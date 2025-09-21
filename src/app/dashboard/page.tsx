"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Activity, 
  Network, 
  Zap,
  Target,
  LogOut,
  Search,
  Bell,
  Settings,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';


// Signal Card Component
const SignalCard: React.FC<{ 
  ticker: string; 
  signalType: 'bullish' | 'bearish' | 'neutral'; 
  probability: number; 
  price: number; 
  change: number;
  reason: string;
  riskScore: number;
}> = ({ ticker, signalType, probability, price, change, reason, riskScore }) => {
  const signalColors = {
    bullish: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400', icon: TrendingUp },
    bearish: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', icon: TrendingDown },
    neutral: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', icon: Minus }
  };

  const colors = signalColors[signalType];
  const IconComponent = colors.icon;

  return (
    <Card className={`rounded-xl border ${colors.border} ${colors.bg} hover:scale-105 transition-all duration-200`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colors.bg}`}>
              <IconComponent className={`w-4 h-4 ${colors.text}`} />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-100">{ticker}</h3>
              <p className={`text-xs font-medium ${colors.text} capitalize`}>
                {signalType} Signal
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-zinc-100 font-semibold">${price.toFixed(2)}</p>
            <p className={`text-xs ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-zinc-400">{reason}</p>
          <div className="flex items-center gap-1 group relative">
            <div className="w-2 h-2 rounded-full bg-zinc-600" />
            <span className="text-xs text-zinc-500 cursor-help">{probability}%</span>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
              Model confidence in this signal prediction
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-800"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Risk Score:</span>
          <span className={`text-xs font-medium ${
            riskScore <= 3 ? 'text-green-400' : 
            riskScore <= 6 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {riskScore}/10
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// Market Network Visualization Component
const MarketNetwork: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);
  
  const nodes = [
    // Tech Stocks
    { ticker: 'AAPL', sector: 'tech', color: '#B066FF', x: 25, y: 25, size: 7, riskScore: 4, sentiment: 'bullish', influences: ['SPY', 'VIX'] },
    { ticker: 'NVDA', sector: 'tech', color: '#B066FF', x: 35, y: 15, size: 7, riskScore: 3, sentiment: 'bullish', influences: ['AAPL', 'MSFT'] },
    { ticker: 'MSFT', sector: 'tech', color: '#B066FF', x: 15, y: 35, size: 7, riskScore: 6, sentiment: 'neutral', influences: ['SPY'] },
    { ticker: 'GOOGL', sector: 'tech', color: '#B066FF', x: 45, y: 25, size: 7, riskScore: 5, sentiment: 'bullish', influences: ['AAPL', 'NVDA'] },
    
    // Finance Stocks
    { ticker: 'JPM', sector: 'finance', color: '#4ECDC4', x: 65, y: 30, size: 7, riskScore: 7, sentiment: 'bearish', influences: ['DXY', 'SPY'] },
    { ticker: 'BAC', sector: 'finance', color: '#4ECDC4', x: 75, y: 20, size: 7, riskScore: 6, sentiment: 'neutral', influences: ['JPM', 'WFC'] },
    { ticker: 'GS', sector: 'finance', color: '#4ECDC4', x: 55, y: 40, size: 7, riskScore: 8, sentiment: 'bearish', influences: ['JPM', 'DXY'] },
    { ticker: 'WFC', sector: 'finance', color: '#4ECDC4', x: 85, y: 35, size: 7, riskScore: 5, sentiment: 'neutral', influences: ['BAC'] },
    
    // Insurance Stocks
    { ticker: 'BRK.B', sector: 'insurance', color: '#45B7D1', x: 20, y: 65, size: 7, riskScore: 3, sentiment: 'bullish', influences: ['SPY', 'AAPL'] },
    { ticker: 'AXP', sector: 'insurance', color: '#45B7D1', x: 30, y: 75, size: 7, riskScore: 7, sentiment: 'bearish', influences: ['JPM'] },
    { ticker: 'AIG', sector: 'insurance', color: '#45B7D1', x: 10, y: 55, size: 7, riskScore: 6, sentiment: 'neutral', influences: ['DXY', 'VIX'] },
    
    // Energy Stocks
    { ticker: 'XOM', sector: 'energy', color: '#FF6B6B', x: 70, y: 70, size: 7, riskScore: 9, sentiment: 'bearish', influences: ['CVX', 'COP'] },
    { ticker: 'CVX', sector: 'energy', color: '#FF6B6B', x: 80, y: 60, size: 7, riskScore: 8, sentiment: 'bearish', influences: ['XOM', 'DXY'] },
    { ticker: 'COP', sector: 'energy', color: '#FF6B6B', x: 60, y: 80, size: 7, riskScore: 7, sentiment: 'neutral', influences: ['XOM'] },
    
    // Indices
    { ticker: 'SPY', sector: 'index', color: '#96CEB4', x: 50, y: 50, size: 9, riskScore: 4, sentiment: 'bullish', influences: [] },
    { ticker: 'DXY', sector: 'index', color: '#96CEB4', x: 40, y: 60, size: 9, riskScore: 6, sentiment: 'neutral', influences: [] },
    { ticker: 'VIX', sector: 'index', color: '#96CEB4', x: 60, y: 50, size: 9, riskScore: 9, sentiment: 'bearish', influences: [] }
  ];

  const sectorColors = {
    tech: '#B066FF',
    finance: '#4ECDC4', 
    insurance: '#45B7D1',
    energy: '#FF6B6B',
    index: '#96CEB4'
  };

  const getNodeInfo = (ticker: string) => {
    const mockData: Record<string, { price: number; change: number; volume: string }> = {
      'AAPL': { price: 175.43, change: 2.3, volume: '45.2M' },
      'NVDA': { price: 421.67, change: 4.2, volume: '78.1M' },
      'MSFT': { price: 378.91, change: 0.4, volume: '32.8M' },
      'GOOGL': { price: 142.33, change: 1.9, volume: '28.4M' },
      'JPM': { price: 158.22, change: -0.8, volume: '12.6M' },
      'BAC': { price: 31.45, change: 0.7, volume: '38.9M' },
      'GS': { price: 342.18, change: -1.2, volume: '2.1M' },
      'WFC': { price: 42.67, change: 0.3, volume: '25.3M' },
      'BRK.B': { price: 362.84, change: 1.1, volume: '3.8M' },
      'AXP': { price: 198.45, change: -0.5, volume: '4.2M' },
      'AIG': { price: 67.23, change: 0.9, volume: '8.7M' },
      'XOM': { price: 118.76, change: -2.1, volume: '18.4M' },
      'CVX': { price: 156.89, change: -1.8, volume: '9.6M' },
      'COP': { price: 125.34, change: -0.7, volume: '6.8M' },
      'SPY': { price: 445.67, change: 1.2, volume: '156.2M' },
      'DXY': { price: 103.45, change: -0.3, volume: 'N/A' },
      'VIX': { price: 18.23, change: -5.2, volume: 'N/A' }
    };
    return mockData[ticker] || { price: 0, change: 0, volume: 'N/A' };
  };

  const findMostConnectedNodes = (ticker: string) => {
    const selectedNode = nodes.find(n => n.ticker === ticker);
    if (!selectedNode) return [];

    // Create a connection score for each node
    const connectionScores: Record<string, number> = {};
    
    // Initialize all scores to 0
    nodes.forEach(node => {
      connectionScores[node.ticker] = 0;
    });

    // Score based on influences (outgoing connections)
    selectedNode.influences.forEach(influence => {
      connectionScores[influence] += 2; // Higher weight for direct influences
    });

    // Score based on reverse influences (incoming connections)
    nodes.forEach(node => {
      if (node.influences.includes(ticker)) {
        connectionScores[node.ticker] += 1.5; // Weight for nodes that influence the selected one
      }
    });

    // Score based on shared influences (nodes that influence the same targets)
    selectedNode.influences.forEach(influence => {
      nodes.forEach(node => {
        if (node.influences.includes(influence) && node.ticker !== ticker) {
          connectionScores[node.ticker] += 0.5;
        }
      });
    });

    // Sort by connection score and return top 4 (excluding the selected node itself)
    const sortedNodes = Object.entries(connectionScores)
      .filter(([nodeTicker]) => nodeTicker !== ticker)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([ticker]) => ticker);

    return sortedNodes;
  };


  return (
    <div className="relative w-full h-96 bg-zinc-900/60 rounded-2xl border border-white/20 p-4 overflow-hidden">
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full" 
        style={{ padding: 0, margin: 0 }}
        onClick={() => {
          setSelectedNode(null);
          setHighlightedNodes([]);
        }}
      >
        {/* Connections */}
        <g stroke="#6B7280" strokeWidth="0.4" opacity="0.6">
          {(() => {
            // Predefined connections to avoid hydration issues
            const connections = [
              // Tech sector connections
              ['AAPL', 'NVDA'], ['AAPL', 'MSFT'], ['AAPL', 'GOOGL'], ['NVDA', 'GOOGL'], ['MSFT', 'GOOGL'],
              // Finance sector connections
              ['JPM', 'BAC'], ['JPM', 'GS'], ['BAC', 'WFC'], ['GS', 'WFC'],
              // Insurance sector connections
              ['BRK.B', 'AXP'], ['BRK.B', 'AIG'], ['AXP', 'AIG'],
              // Energy sector connections
              ['XOM', 'CVX'], ['XOM', 'COP'], ['CVX', 'COP'],
              // Cross-sector connections
              ['AAPL', 'SPY'], ['NVDA', 'SPY'], ['JPM', 'SPY'], ['BRK.B', 'SPY'],
              ['AAPL', 'VIX'], ['JPM', 'DXY'], ['BRK.B', 'DXY'], ['XOM', 'DXY'],
              ['AAPL', 'JPM'], ['NVDA', 'JPM'], ['GOOGL', 'BRK.B']
            ];
            
            return connections.map(([ticker1, ticker2], index) => {
              const node1 = nodes.find(n => n.ticker === ticker1);
              const node2 = nodes.find(n => n.ticker === ticker2);
              if (!node1 || !node2) return null;
              
              const nodePos1 = { x: node1.x, y: node1.y };
              const nodePos2 = { x: node2.x, y: node2.y };
              
              return (
                <line 
                  key={`${ticker1}-${ticker2}`}
                  x1={nodePos1.x} 
                  y1={nodePos1.y} 
                  x2={nodePos2.x} 
                  y2={nodePos2.y}
                  strokeDasharray="0.5,0.5"
                >
                  <animate
                    attributeName="opacity"
                    values="0.3;0.7;0.3"
                    dur="5s"
                    begin={`${index * 0.3}s`}
                    repeatCount="indefinite"
                  />
                </line>
              );
            }).filter(Boolean);
          })()}
        </g>

        {/* Nodes */}
        {nodes.map((node, i) => {
          const isSelected = selectedNode === node.ticker;
          const isHighlighted = highlightedNodes.includes(node.ticker);
          const shouldDim = selectedNode && !isSelected && !isHighlighted;
          
          return (
            <g key={node.ticker}>
              {/* Connection pulse for selected node */}
              {isSelected && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size + 3}
                  fill="none"
                  stroke={node.color}
                  strokeWidth="0.5"
                  opacity="0.6"
                >
                  <animate
                    attributeName="r"
                    values={`${node.size + 3};${node.size + 6};${node.size + 3}`}
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.6;0.2;0.6"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              
              {/* Node circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size}
                fill={node.color}
                opacity={shouldDim ? "0.2" : isSelected ? "1" : "0.8"}
                stroke={isSelected ? "#ffffff" : "none"}
                strokeWidth={isSelected ? "1" : "0"}
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isSelected) {
                    setSelectedNode(null);
                    setHighlightedNodes([]);
                  } else {
                    setSelectedNode(node.ticker);
                    setHighlightedNodes(findMostConnectedNodes(node.ticker));
                  }
                }}
              >
                <animate
                  attributeName="r"
                  values={`${node.size};${node.size + 0.5};${node.size}`}
                  dur="3s"
                  begin={`${i * 0.1}s`}
                  repeatCount="indefinite"
                />
              </circle>
              
              {/* Ticker label - always visible */}
              <text
                x={node.x}
                y={node.y + 1}
                textAnchor="middle"
                className="fill-white font-semibold pointer-events-none"
                fontSize="3.5"
                style={{ 
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  opacity: shouldDim ? "0.3" : "1"
                }}
              >
                {node.ticker}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Node info panel */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 bg-zinc-800/95 backdrop-blur-sm rounded-xl border border-white/20 p-4 min-w-48"
        >
          <div className="flex items-center gap-2 mb-3">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: nodes.find(n => n.ticker === selectedNode)?.color }}
            />
            <h4 className="font-semibold text-zinc-100">{selectedNode}</h4>
          </div>
          
          {(() => {
            const info = getNodeInfo(selectedNode);
            const node = nodes.find(n => n.ticker === selectedNode);
            return (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Price:</span>
                  <span className="text-zinc-100">${info.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Change:</span>
                  <span className={info.change >= 0 ? "text-green-400" : "text-red-400"}>
                    {info.change >= 0 ? '+' : ''}{info.change.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Volume:</span>
                  <span className="text-zinc-100">{info.volume}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Sector:</span>
                  <span className="text-zinc-100 capitalize">{node?.sector}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Sentiment:</span>
                  <span className={`font-medium capitalize ${
                    node?.sentiment === 'bullish' ? 'text-green-400' :
                    node?.sentiment === 'bearish' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {node?.sentiment}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Risk Score:</span>
                  <span className={`font-medium ${
                    (node?.riskScore || 0) <= 3 ? 'text-green-400' : 
                    (node?.riskScore || 0) <= 6 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {node?.riskScore}/10
                  </span>
                </div>
                <div className="pt-2 border-t border-zinc-700/50">
                  <div className="flex justify-between items-start">
                    <span className="text-zinc-400 text-xs">Influences:</span>
                    <div className="flex flex-wrap gap-1 ml-2">
                      {node?.influences && node.influences.length > 0 ? (
                        node.influences.map((influence) => {
                          const influenceNode = nodes.find(n => n.ticker === influence);
                          return (
                            <span
                              key={influence}
                              className="px-2 py-1 text-xs rounded-md font-medium"
                              style={{ 
                                backgroundColor: `${influenceNode?.color}20`,
                                color: influenceNode?.color,
                                border: `1px solid ${influenceNode?.color}40`
                              }}
                            >
                              {influence}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-xs text-zinc-500 italic">None detected</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}
      
      <div className="absolute bottom-4 left-4">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#B066FF" }} />
          Live Market Network
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4">
        <div className="flex flex-wrap gap-2 text-xs">
          {Object.entries(sectorColors).map(([sector, color]) => (
            <div key={sector} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-zinc-400 capitalize">{sector}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Sidebar Navigation Component
const Sidebar: React.FC<{ isOpen: boolean; onToggle: () => void }> = ({ isOpen, onToggle }) => {
  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', status: 'active' },
    { name: 'Graph Visualizer', href: '#', status: 'soon' },
    { name: 'Signals Explorer', href: '#', status: 'soon' },
    { name: 'Portfolio Risk Score', href: '#', status: 'soon' },
    { name: 'Regime Detection', href: '#', status: 'soon' },
    { name: 'Embeddings Explorer', href: '#', status: 'soon' },
    { name: 'Model Performance', href: '#', status: 'soon' },
    { name: 'API Playground', href: '#', status: 'soon' },
    { name: 'Documentation', href: '#', status: 'soon' }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-screen overflow-y-auto z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:z-auto lg:flex-shrink-0
        w-64 bg-zinc-900/95 border-r border-white/10
      `}>
        <div className="p-6">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
            <Image 
              src="/icon-white-transparent.svg" 
              alt="RavenGraph Logo" 
              width={32}
              height={32}
              className="w-8 h-8"
            />
              <span className="text-xl font-semibold text-zinc-100">RavenGraph</span>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
            >
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                item.status === 'active'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{item.name}</span>
                {item.status === 'soon' && (
                  <span className="text-xs px-2 py-1 rounded-full bg-zinc-700/50 text-zinc-500 border border-zinc-600/50">
                    Soon
                  </span>
                )}
              </div>
            </a>
          ))}
        </nav>
        </div>
      </div>
    </>
  );
};

export default function Dashboard() {
  const { logout } = useAuth();
  const router = useRouter();
  const [watchlist, setWatchlist] = useState(['AAPL', 'TSLA', 'NVDA']);
  const [newTicker, setNewTicker] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const addToWatchlist = () => {
    if (newTicker && !watchlist.includes(newTicker.toUpperCase())) {
      setWatchlist([...watchlist, newTicker.toUpperCase()]);
      setNewTicker('');
    }
  };

  const signals = [
    { ticker: 'AAPL', signalType: 'bullish' as const, probability: 78, price: 175.43, change: 2.3, reason: 'Momentum clustering detected in tech sector', riskScore: 4 },
    { ticker: 'TSLA', signalType: 'bearish' as const, probability: 72, price: 248.12, change: -1.8, reason: 'Volatility regime shift identified', riskScore: 8 },
    { ticker: 'NVDA', signalType: 'bullish' as const, probability: 85, price: 421.67, change: 4.2, reason: 'Cross-sector correlation strength increasing', riskScore: 3 },
    { ticker: 'MSFT', signalType: 'neutral' as const, probability: 52, price: 378.91, change: 0.4, reason: 'Mixed embedding signals detected', riskScore: 6 },
    { ticker: 'GOOGL', signalType: 'bullish' as const, probability: 69, price: 142.33, change: 1.9, reason: 'Lead-lag relationship with search sentiment', riskScore: 5 }
  ];

  const sectorOutlook = [
    { name: 'Technology', outlook: 'bullish', strength: 85 },
    { name: 'Healthcare', outlook: 'neutral', strength: 52 },
    { name: 'Energy', outlook: 'bearish', strength: 34 },
    { name: 'Finance', outlook: 'bullish', strength: 78 },
    { name: 'Consumer', outlook: 'neutral', strength: 61 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 text-zinc-100">
      <div className="lg:flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        
        {/* Main Content */}
        <div className="flex-1 lg:ml-0 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/40 border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
              >
                <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span className="font-semibold tracking-wide text-lg">Dashboard</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search signals..."
                  className="pl-10 pr-4 py-2 w-64 rounded-xl border border-white/20 bg-zinc-900/70 text-zinc-100 placeholder:text-zinc-500 text-sm"
                />
              </div>
              
              <button className="p-2 rounded-xl hover:bg-zinc-800/50 transition-colors">
                <Bell className="w-5 h-5 text-zinc-400" />
              </button>
              
              <button className="p-2 rounded-xl hover:bg-zinc-800/50 transition-colors">
                <Settings className="w-5 h-5 text-zinc-400" />
              </button>
              
              <Button 
                onClick={handleLogout}
              variant="outline" 
              className="rounded-xl border-white/20 hover:bg-zinc-800/50 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-semibold text-zinc-100 mb-2">
            Welcome back, Ralph
          </h1>
          <p className="text-zinc-400">
            Market intelligence powered by RavenGraph&apos;s network analysis
          </p>
        </motion.div>

        {/* Hero Overview - Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="rounded-2xl border-white/20 bg-zinc-900/80 hover:bg-zinc-900/90 transition-all duration-300">
              <CardContent className="pt-1 px-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Market Sentiment</p>
                    <p className="text-2xl font-semibold text-zinc-100">Bullish</p>
                    <p className="text-xs text-green-400 mt-1">+12% from yesterday</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(176,102,255,0.1)" }}>
                    <TrendingUp className="w-6 h-6" style={{ color: "#B066FF" }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="rounded-2xl border-white/20 bg-zinc-900/80 hover:bg-zinc-900/90 transition-all duration-300">
              <CardContent className="pt-1 px-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Volatility Regime</p>
                    <p className="text-2xl font-semibold text-zinc-100">Low</p>
                    <p className="text-xs text-blue-400 mt-1">Stable conditions</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(176,102,255,0.1)" }}>
                    <Activity className="w-6 h-6" style={{ color: "#B066FF" }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="rounded-2xl border-white/20 bg-zinc-900/80 hover:bg-zinc-900/90 transition-all duration-300">
              <CardContent className="pt-1 px-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Signals Today</p>
                    <p className="text-2xl font-semibold text-zinc-100">247</p>
                    <p className="text-xs text-purple-400 mt-1">+18 new alerts</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(176,102,255,0.1)" }}>
                    <Zap className="w-6 h-6" style={{ color: "#B066FF" }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="rounded-2xl border-white/20 bg-zinc-900/80 hover:bg-zinc-900/90 transition-all duration-300">
              <CardContent className="pt-1 px-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Model Accuracy</p>
                    <p className="text-2xl font-semibold text-zinc-100">87.3%</p>
                    <p className="text-xs text-green-400 mt-1">30-day rolling</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(176,102,255,0.1)" }}>
                    <Target className="w-6 h-6" style={{ color: "#B066FF" }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Signals & Market Network */}
          <div className="lg:col-span-2 space-y-8">
            {/* Market Network Visualization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="rounded-2xl border-white/20 bg-zinc-900/80">
                <CardContent className="pt-1 px-6 pb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-zinc-100">Live Market Network</h3>
                    <div className="flex items-center gap-2 text-sm" style={{ color: "#B066FF" }}>
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#B066FF" }} />
                      RavenPulse™ Active
                    </div>
                  </div>
                  <MarketNetwork />
                </CardContent>
              </Card>
            </motion.div>

            {/* Buy/Sell/Neutral Signals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="rounded-2xl border-white/20 bg-zinc-900/80">
                <CardContent className="pt-1 px-6 pb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-zinc-100">Probabilistic Signal Feed</h3>
                    <Button className="rounded-xl" style={{ backgroundColor: "#B066FF", borderColor: "#B066FF" }}>
                      <Network className="w-4 h-4 mr-2" />
                      Explore Graph
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {signals.map((signal) => (
                      <motion.div
                        key={signal.ticker}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.7 }}
                      >
                        <SignalCard {...signal} />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Daily Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className="rounded-2xl border-white/20 bg-zinc-900/80">
                <CardContent className="pt-1 px-6 pb-6">
                  <h3 className="text-lg font-semibold text-zinc-100 mb-4">Daily Insights</h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <p className="text-sm text-blue-400 font-medium mb-2">Volatility Clustering Detected</p>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        Volatility clustering detected in Energy sector; correlation to Tech increasing. Cross-sector influence coefficient up 23% in the last 2 hours.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                      <p className="text-sm text-green-400 font-medium mb-2">Lead-Lag Relationship</p>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        Gold futures now leading tech sector by ~3.5 minutes. Historical accuracy: 78%. Monitor GLD → XLK signal propagation.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <p className="text-sm text-purple-400 font-medium mb-2">Embedding Space Shift</p>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        Healthcare sector clustering pattern changed. Stocks moving from &quot;defensive&quot; to &quot;growth&quot; embedding space.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Portfolio Watchlist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="rounded-2xl border-white/20 bg-zinc-900/80">
                <CardContent className="pt-1 px-6 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-zinc-100">Watchlist</h3>
                    <div className="flex gap-2">
                      <Input
                        value={newTicker}
                        onChange={(e) => setNewTicker(e.target.value)}
                        placeholder="Ticker"
                        className="w-20 h-8 text-xs border-white/20 bg-zinc-800/50"
                        onKeyPress={(e) => e.key === 'Enter' && addToWatchlist()}
                      />
                      <Button
                        onClick={addToWatchlist}
                        size="sm"
                        className="h-8 px-2"
                        style={{ backgroundColor: "#B066FF", borderColor: "#B066FF" }}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {watchlist.map((ticker) => (
                      <div key={ticker} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                        <div>
                          <p className="font-semibold text-zinc-100">{ticker}</p>
                          <p className="text-xs text-zinc-400">Next-day outlook: +2.3%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-green-400 font-medium">87% probability</p>
                          <p className="text-xs text-zinc-500">Bullish signal</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sector Outlook */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <Card className="rounded-2xl border-white/20 bg-zinc-900/80">
                <CardContent className="pt-1 px-6 pb-6">
                  <h3 className="text-lg font-semibold text-zinc-100 mb-4">Sector Outlook</h3>
                  <div className="space-y-3">
                    {sectorOutlook.map((sector) => (
                      <div key={sector.name} className="flex items-center justify-between">
                        <span className="text-sm text-zinc-300">{sector.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-zinc-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                sector.outlook === 'bullish' ? 'bg-green-500' :
                                sector.outlook === 'bearish' ? 'bg-red-500' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${sector.strength}%` }}
                            />
                          </div>
                          <span className="text-xs text-zinc-400 w-8 text-right">{sector.strength}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* API Integration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <Card className="rounded-2xl border-white/20 bg-zinc-900/80">
                <CardContent className="pt-1 px-6 pb-6">
                  <h3 className="text-lg font-semibold text-zinc-100 mb-4">API Integration</h3>
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                          <span className="text-xs font-medium text-zinc-300">GET /signals</span>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                          Live
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-mono">/signals?symbol=AAPL&timeframe=1d</p>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-400" />
                          <span className="text-xs font-medium text-zinc-300">GET /embeddings</span>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                          Beta
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-mono">/embeddings?sector=tech</p>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-400" />
                          <span className="text-xs font-medium text-zinc-300">GET /correlations</span>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          Stable
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-mono">/correlations?lead=AAPL&lag=SPY</p>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-400" />
                          <span className="text-xs font-medium text-zinc-300">GET /risk-score</span>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                          Beta
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-mono">/risk-score?portfolio=AAPL,TSLA,NVDA</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-xs text-blue-400">
                      All signals available via API & dashboards. Plug into your strategy.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* System Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <Card className="rounded-2xl border-white/20 bg-zinc-900/80">
                <CardContent className="pt-1 px-6 pb-6">
                  <h3 className="text-lg font-semibold text-zinc-100 mb-4">Model Performance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-300">Directional Accuracy</span>
                      <span className="text-sm font-semibold text-green-400">87.3%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-300">Sharpe Ratio</span>
                      <span className="text-sm font-semibold text-blue-400">2.41</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-300">Lift vs Baseline</span>
                      <span className="text-sm font-semibold text-purple-400">+23%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-300">Top Feature</span>
                      <span className="text-xs text-zinc-400">Sector Correlation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="border-t border-white/10 bg-zinc-900/80">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* Disclaimer */}
          <div className="text-center mb-6">
            <p className="text-xs text-zinc-500">
              <strong className="text-zinc-400">Disclaimer:</strong> RavenGraph provides market analytics and probabilistic signals for informational purposes only. 
              Not investment advice. All data and signals are for research and analysis purposes.
            </p>
          </div>
          
          {/* Trademark Footer */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-zinc-800/50">
            <Image 
              src="/logo-no-background 2.svg" 
              alt="RavenGraph Logo" 
              width={64}
              height={64}
              className="w-16 h-16 opacity-80"
            />
            <div className="text-center">
              <p className="text-xs text-zinc-600">
                &copy; 2025 RavenGraph. All rights reserved.
              </p>
              <p className="text-xs text-zinc-600">
                RavenGraph&trade; and RavenPulse&trade; are trademarks of RavenGraph Inc.
              </p>
            </div>
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}