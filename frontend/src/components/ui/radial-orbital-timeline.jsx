import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RadialOrbitalTimeline({ timelineData }) {
    const [expandedItems, setExpandedItems] = useState({});
    const [rotationAngle, setRotationAngle] = useState(0);
    const [autoRotate, setAutoRotate] = useState(true);
    const [pulseEffect, setPulseEffect] = useState({});
    const [centerOffset] = useState({ x: 0, y: 0 });
    const [activeNodeId, setActiveNodeId] = useState(null);
    const containerRef = useRef(null);
    const orbitRef = useRef(null);
    const nodeRefs = useRef({});

    const handleContainerClick = (e) => {
        if (e.target === containerRef.current || e.target === orbitRef.current) {
            setExpandedItems({});
            setActiveNodeId(null);
            setPulseEffect({});
            setAutoRotate(true);
        }
    };

    const toggleItem = (id) => {
        setExpandedItems((prev) => {
            const newState = { ...prev };
            Object.keys(newState).forEach((key) => {
                if (parseInt(key) !== id) {
                    newState[parseInt(key)] = false;
                }
            });

            newState[id] = !prev[id];

            if (!prev[id]) {
                setActiveNodeId(id);
                setAutoRotate(false);

                const relatedItems = getRelatedItems(id);
                const newPulseEffect = {};
                relatedItems.forEach((relId) => {
                    newPulseEffect[relId] = true;
                });
                setPulseEffect(newPulseEffect);

                centerViewOnNode(id);
            } else {
                setActiveNodeId(null);
                setAutoRotate(true);
                setPulseEffect({});
            }

            return newState;
        });
    };

    useEffect(() => {
        let rotationTimer;

        if (autoRotate) {
            rotationTimer = setInterval(() => {
                setRotationAngle((prev) => {
                    const newAngle = (prev + 0.3) % 360;
                    return Number(newAngle.toFixed(3));
                });
            }, 50);
        }

        return () => {
            if (rotationTimer) {
                clearInterval(rotationTimer);
            }
        };
    }, [autoRotate]);

    const centerViewOnNode = (nodeId) => {
        const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
        const totalNodes = timelineData.length;
        const targetAngle = (nodeIndex / totalNodes) * 360;
        setRotationAngle(270 - targetAngle);
    };

    const calculateNodePosition = (index, total) => {
        const angle = ((index / total) * 360 + rotationAngle) % 360;
        const radius = 200;
        const radian = (angle * Math.PI) / 180;

        const x = radius * Math.cos(radian) + centerOffset.x;
        const y = radius * Math.sin(radian) + centerOffset.y;

        const zIndex = Math.round(100 + 50 * Math.cos(radian));
        const opacity = Math.max(
            0.4,
            Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
        );

        return { x, y, angle, zIndex, opacity };
    };

    const getRelatedItems = (itemId) => {
        const currentItem = timelineData.find((item) => item.id === itemId);
        return currentItem ? currentItem.relatedIds : [];
    };

    const isRelatedToActive = (itemId) => {
        if (!activeNodeId) return false;
        const relatedItems = getRelatedItems(activeNodeId);
        return relatedItems.includes(itemId);
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case "completed":
                return "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 border-primary-200 dark:border-primary-800";
            case "in-progress":
                return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800";
            case "pending":
                return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
            default:
                return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
        }
    };

    return (
        <div
            className="w-full h-[600px] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 overflow-hidden relative rounded-3xl border border-slate-200 dark:border-slate-800"
            ref={containerRef}
            onClick={handleContainerClick}
        >
            <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
                <div
                    className="absolute w-full h-full flex items-center justify-center"
                    ref={orbitRef}
                    style={{
                        perspective: "1000px",
                        transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
                    }}
                >
                    {/* Center orb */}
                    <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 animate-pulse flex items-center justify-center z-10 shadow-glow">
                        <div className="absolute w-20 h-20 rounded-full border border-primary-200/50 dark:border-primary-500/30 animate-ping opacity-70"></div>
                        <div
                            className="absolute w-24 h-24 rounded-full border border-primary-100/30 dark:border-primary-500/20 animate-ping opacity-50"
                            style={{ animationDelay: "0.5s" }}
                        ></div>
                        <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm"></div>
                    </div>

                    {/* Orbit ring */}
                    <div className="absolute w-96 h-96 rounded-full border border-slate-200 dark:border-slate-700/50"></div>

                    {timelineData.map((item, index) => {
                        const position = calculateNodePosition(index, timelineData.length);
                        const isExpanded = expandedItems[item.id];
                        const isRelated = isRelatedToActive(item.id);
                        const isPulsing = pulseEffect[item.id];
                        const Icon = item.icon;

                        const nodeStyle = {
                            transform: `translate(${position.x}px, ${position.y}px)`,
                            zIndex: isExpanded ? 200 : position.zIndex,
                            opacity: isExpanded ? 1 : position.opacity,
                        };

                        return (
                            <div
                                key={item.id}
                                ref={(el) => (nodeRefs.current[item.id] = el)}
                                className="absolute transition-all duration-700 cursor-pointer"
                                style={nodeStyle}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(item.id);
                                }}
                            >
                                {/* Energy glow */}
                                <div
                                    className={`absolute rounded-full -inset-1 ${isPulsing ? "animate-pulse duration-1000" : ""
                                        }`}
                                    style={{
                                        background: `radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, rgba(255,255,255,0) 70%)`,
                                        width: `${item.energy * 0.5 + 40}px`,
                                        height: `${item.energy * 0.5 + 40}px`,
                                        left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                                        top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                                    }}
                                ></div>

                                {/* Node icon */}
                                <div
                                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${isExpanded
                                            ? "bg-white text-primary-600 shadow-lg ring-4 ring-primary-50 dark:ring-primary-900/50"
                                            : isRelated
                                                ? "bg-white text-primary-600 ring-2 ring-primary-200 dark:ring-primary-800"
                                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                                        }
                    transition-all duration-300 transform
                    ${isExpanded ? "scale-125" : "hover:scale-110"}
                  `}
                                >
                                    <Icon size={16} />
                                </div>

                                {/* Label */}
                                <div
                                    className={`
                    absolute top-12 whitespace-nowrap
                    text-xs font-semibold tracking-wider
                    transition-all duration-300
                    ${isExpanded
                                            ? "text-slate-900 dark:text-white scale-110"
                                            : "text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100"
                                        }
                  `}
                                >
                                    {item.title}
                                </div>

                                {/* Expanded card */}
                                {isExpanded && (
                                    <Card className="absolute top-16 left-1/2 -translate-x-1/2 w-72 z-50 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-slate-300 dark:bg-slate-600"></div>
                                        <CardHeader className="pb-2 pt-4 px-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <Badge
                                                    className={`px-2 py-0.5 text-[10px] font-medium border ${getStatusStyles(item.status)}`}
                                                    variant="outline"
                                                >
                                                    {item.status === "completed"
                                                        ? "COMPLETE"
                                                        : item.status === "in-progress"
                                                            ? "IN PROGRESS"
                                                            : "PENDING"}
                                                </Badge>
                                                <span className="text-[10px] font-mono text-slate-400">
                                                    {item.date}
                                                </span>
                                            </div>
                                            <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                                                {item.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400">
                                            <p className="leading-relaxed mb-4">{item.content}</p>

                                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                                                <div className="flex justify-between items-center text-[10px] mb-1.5 text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <Zap size={10} />
                                                        Impact Level
                                                    </span>
                                                    <span className="font-mono font-medium">{item.energy}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-primary-400 to-accent-400 rounded-full"
                                                        style={{ width: `${item.energy}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {item.relatedIds.length > 0 && (
                                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                                                    <div className="flex items-center mb-2">
                                                        <Link size={10} className="text-slate-400 mr-1.5" />
                                                        <h4 className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                                                            Related Milestones
                                                        </h4>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {item.relatedIds.map((relatedId) => {
                                                            const relatedItem = timelineData.find(
                                                                (i) => i.id === relatedId
                                                            );
                                                            return (
                                                                <button
                                                                    key={relatedId}
                                                                    className="flex items-center px-2 py-1 text-[10px] rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleItem(relatedId);
                                                                    }}
                                                                >
                                                                    {relatedItem?.title}
                                                                    <ArrowRight
                                                                        size={8}
                                                                        className="ml-1 text-slate-400"
                                                                    />
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
