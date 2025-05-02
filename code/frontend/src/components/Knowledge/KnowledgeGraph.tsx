import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { NodeResponse } from '../../api/nodeService';
import './Knowledge.css';

interface Link {
    id: string;
    source: string;
    target: string;
    type: string;
}

interface KnowledgeGraphProps {
    nodes: NodeResponse[];
    links: Link[];
    onNodeClick?: (node: NodeResponse) => void;
    selectedNodeId?: string;
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({
    nodes,
    links,
    onNodeClick,
    selectedNodeId,
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const simulationRef = useRef<d3.Simulation<any, any> | null>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [visibleNodes, setVisibleNodes] = useState<NodeResponse[]>([]);
    const [visibleLinks, setVisibleLinks] = useState<Link[]>([]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (svgRef.current) {
                const container = svgRef.current.parentElement;
                if (container) {
                    setDimensions({
                        width: container.clientWidth,
                        height: container.clientHeight,
                    });
                }
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Filter nodes and links for better performance
    useEffect(() => {
        // Limit the number of nodes to display for better performance
        const MAX_VISIBLE_NODES = 100;

        // If selected node exists, prioritize it and its connections
        if (selectedNodeId && nodes.length > MAX_VISIBLE_NODES) {
            // Find the selected node
            const selectedNode = nodes.find(node => node.id === selectedNodeId);

            if (selectedNode) {
                // Get all nodes directly connected to the selected node
                const connectedNodeIds = new Set<string>();
                links.forEach(link => {
                    if (link.source === selectedNodeId) {
                        connectedNodeIds.add(link.target);
                    } else if (link.target === selectedNodeId) {
                        connectedNodeIds.add(link.source);
                    }
                });

                // Add the selected node and its connections
                const priorityNodes = [
                    selectedNode,
                    ...nodes.filter(node => connectedNodeIds.has(node.id))
                ];

                // Add other nodes up to the maximum
                const remainingCount = MAX_VISIBLE_NODES - priorityNodes.length;
                const otherNodes = nodes
                    .filter(node => node.id !== selectedNodeId && !connectedNodeIds.has(node.id))
                    .slice(0, remainingCount);

                setVisibleNodes([...priorityNodes, ...otherNodes]);

                // Filter links to only include visible nodes
                const visibleNodeIds = new Set([...priorityNodes, ...otherNodes].map(n => n.id));
                setVisibleLinks(links.filter(link =>
                    visibleNodeIds.has(link.source) && visibleNodeIds.has(link.target)
                ));
            } else {
                // If selected node not found, just take the first MAX_VISIBLE_NODES
                setVisibleNodes(nodes.slice(0, MAX_VISIBLE_NODES));

                // Filter links accordingly
                const visibleNodeIds = new Set(visibleNodes.map(n => n.id));
                setVisibleLinks(links.filter(link =>
                    visibleNodeIds.has(link.source) && visibleNodeIds.has(link.target)
                ));
            }
        } else {
            // If we have fewer nodes than the maximum, show all of them
            setVisibleNodes(nodes);
            setVisibleLinks(links);
        }
    }, [nodes, links, selectedNodeId]);

    // Memoized node color function
    const getNodeColor = useCallback((node: NodeResponse): string => {
        // Default color
        let color = '#4285f4';

        // Check if node has supertags and use that for coloring
        if (node.metadata && node.metadata.superTags && node.metadata.superTags.length > 0) {
            const superTagName = node.metadata.superTags[0].name;

            // Simple hash function to generate consistent colors for supertags
            const hash = superTagName.split('').reduce((acc: number, char: string) => {
                return char.charCodeAt(0) + ((acc << 5) - acc);
            }, 0);

            const h = Math.abs(hash % 360);
            color = `hsl(${h}, 70%, 60%)`;
        }

        return color;
    }, []);

    // Create and update the graph visualization
    useEffect(() => {
        if (!svgRef.current || visibleNodes.length === 0) return;

        // Clear previous graph
        d3.select(svgRef.current).selectAll('*').remove();

        // Create the SVG container
        const svg = d3.select(svgRef.current)
            .attr('width', dimensions.width)
            .attr('height', dimensions.height);

        // Create a group for the graph
        const g = svg.append('g');

        // Add zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, any>) => {
                g.attr('transform', event.transform.toString());
            });

        svg.call(zoom as any);

        // Prepare the data for D3
        const nodeMap = new Map(visibleNodes.map(node => [node.id, node]));
        const graphLinks = visibleLinks.filter(link =>
            nodeMap.has(link.source) && nodeMap.has(link.target)
        );

        // Create the simulation with improved performance settings
        const simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id((d: any) => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300).distanceMax(500))
            .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
            .alphaDecay(0.05); // Faster simulation convergence

        // Store simulation reference for cleanup
        simulationRef.current = simulation;

        // Create the links
        const link = g.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(graphLinks)
            .enter()
            .append('line')
            .attr('class', 'link')
            .attr('stroke-width', 1.5)
            .attr('stroke', '#999');

        // Create the nodes
        const node = g.append('g')
            .attr('class', 'nodes')
            .selectAll('g')
            .data(visibleNodes)
            .enter()
            .append('g')
            .attr('class', (d: NodeResponse) => `node ${d.id === selectedNodeId ? 'selected' : ''}`)
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended) as any);

        // Add circles to nodes
        node.append('circle')
            .attr('r', 10)
            .attr('fill', (d: NodeResponse) => getNodeColor(d))
            .attr('stroke', (d: NodeResponse) => d.id === selectedNodeId ? '#ff5722' : '#fff')
            .attr('stroke-width', (d: NodeResponse) => d.id === selectedNodeId ? 3 : 1);

        // Add labels to nodes - only show labels for selected node and its connections
        node.append('text')
            .attr('dy', -15)
            .attr('text-anchor', 'middle')
            .text((d: NodeResponse) => {
                // Always show label for selected node
                if (d.id === selectedNodeId) return d.title;

                // Show labels for nodes directly connected to selected node
                if (selectedNodeId) {
                    const isConnected = visibleLinks.some(link =>
                        (link.source === selectedNodeId && link.target === d.id) ||
                        (link.target === selectedNodeId && link.source === d.id)
                    );
                    if (isConnected) return d.title;
                }

                // For other nodes, show label only if we have fewer than 30 nodes total
                return visibleNodes.length < 30 ? d.title : '';
            })
            .attr('class', 'node-label');

        // Add click event to nodes
        node.on('click', (event: MouseEvent, d: NodeResponse) => {
            if (onNodeClick) {
                event.stopPropagation();
                onNodeClick(d);
            }
        });

        // Use requestAnimationFrame for better performance
        let animationFrameId: number;

        // Update positions on simulation tick
        simulation.nodes(visibleNodes as any).on('tick', () => {
            // Cancel any existing animation frame
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            // Schedule the next update
            animationFrameId = requestAnimationFrame(() => {
                link
                    .attr('x1', (d: any) => d.source.x)
                    .attr('y1', (d: any) => d.source.y)
                    .attr('x2', (d: any) => d.target.x)
                    .attr('y2', (d: any) => d.target.y);

                node
                    .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
            });
        });

        simulation.force('link', d3.forceLink(graphLinks as any).id((d: any) => d.id));

        // Drag functions
        function dragstarted(event: any) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event: any) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event: any) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        // Clean up
        return () => {
            if (simulationRef.current) {
                simulationRef.current.stop();
            }
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [visibleNodes, visibleLinks, dimensions, selectedNodeId, onNodeClick, getNodeColor]);

    return (
        <div className="knowledge-graph-container">
            <svg ref={svgRef} className="knowledge-graph"></svg>
        </div>
    );
};

export default KnowledgeGraph;