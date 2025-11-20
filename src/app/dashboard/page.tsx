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
  Plus,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { GeometricParticleField } from '@/components/GeometricParticleField';

// Reusable Logo Component matching landing page style
const RavenLogo = ({ className }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <Image 
      src="/icon-white-transparent.svg" 
      alt="RavenGraph"
      fill
      className="object-contain"
      style={{ filter: "brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(246deg) brightness(104%) contrast(97%)" }}
    />
  </div>
);

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
    bullish: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', icon: TrendingUp },
    bearish: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', icon: TrendingDown },
    neutral: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', icon: Minus }
  };

  const colors = signalColors[signalType];
  const IconComponent = colors.icon;

  return (
    <Card className={`rounded-xl border ${colors.border} bg-[#151725] hover:bg-[#1A1C2A] transition-all duration-200 group`}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colors.bg}`}>
              <IconComponent className={`w-4 h-4 ${colors.text}`} />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-lg tracking-tight">{ticker}</h3>
              <p className={`text-[10px] uppercase tracking-wider font-medium ${colors.text}`}>
                {signalType}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-mono font-medium">${price.toFixed(2)}</p>
            <p className={`text-xs font-mono ${change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mb-3 pt-2 border-t border-white/5">
          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 pr-2">{reason}</p>
          <div className="flex items-center gap-1.5 group/tooltip relative shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-[#B066FF] animate-pulse" />
            <span className="text-xs font-mono text-[#D8B4FE]">{probability}%</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Risk Score</span>
          <div className="flex gap-0.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-1 h-3 rounded-sm ${i < riskScore ? (riskScore > 7 ? 'bg-rose-500' : riskScore > 4 ? 'bg-yellow-500' : 'bg-emerald-500') : 'bg-white/10'}`}
              />
            ))}
          </div>
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
    <div className="relative w-full h-96 bg-[#0B0C15] rounded-2xl border border-white/10 p-4 overflow-hidden shadow-inner">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full relative z-10" 
        style={{ padding: 0, margin: 0 }}
        onClick={() => {
          setSelectedNode(null);
          setHighlightedNodes([]);
        }}
      >
        {/* Connections */}
        <g stroke="#6B7280" strokeWidth="0.4" opacity="0.4">
          {(() => {
            // Predefined connections
            const connections = [
              ['AAPL', 'NVDA'], ['AAPL', 'MSFT'], ['AAPL', 'GOOGL'], ['NVDA', 'GOOGL'], ['MSFT', 'GOOGL'],
              ['JPM', 'BAC'], ['JPM', 'GS'], ['BAC', 'WFC'], ['GS', 'WFC'],
              ['BRK.B', 'AXP'], ['BRK.B', 'AIG'], ['AXP', 'AIG'],
              ['XOM', 'CVX'], ['XOM', 'COP'], ['CVX', 'COP'],
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
                    values="0.2;0.5;0.2"
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
              
              <text
                x={node.x}
                y={node.y + 1}
                textAnchor="middle"
                className="fill-white font-semibold pointer-events-none font-sans"
                fontSize="3"
                style={{ 
                  textShadow: '0px 2px 4px rgba(0,0,0,0.9)',
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
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute top-4 right-4 bg-[#151725]/95 backdrop-blur-md rounded-xl border border-white/20 p-4 min-w-56 shadow-xl z-20"
        >
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: nodes.find(n => n.ticker === selectedNode)?.color }}
            />
            <h4 className="font-display font-bold text-white text-lg">{selectedNode}</h4>
          </div>
          
          {(() => {
            const info = getNodeInfo(selectedNode);
            const node = nodes.find(n => n.ticker === selectedNode);
            return (
              <div className="space-y-2 text-xs font-medium">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Price</span>
                  <span className="text-white font-mono">${info.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Change</span>
                  <span className={`font-mono ${info.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {info.change >= 0 ? '+' : ''}{info.change.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Sentiment</span>
                  <span className={`capitalize ${
                    node?.sentiment === 'bullish' ? 'text-emerald-400' :
                    node?.sentiment === 'bearish' ? 'text-rose-400' : 'text-yellow-400'
                  }`}>
                    {node?.sentiment}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Risk</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div 
                        key={i}
                        className={`w-1 h-2 rounded-full ${i < (node?.riskScore || 0) / 2 ? 'bg-[#B066FF]' : 'bg-zinc-700'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}
      

      {/* Legend */}
      <div className="absolute bottom-4 right-4">
        <div className="flex flex-wrap gap-3 text-[10px] bg-[#0B0C15]/80 p-2 rounded-lg border border-white/5 backdrop-blur-sm">
          {Object.entries(sectorColors).map(([sector, color]) => (
            <div key={sector} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
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
    { name: 'Portfolio Risk', href: '#', status: 'soon' },
    { name: 'Regime Detection', href: '#', status: 'soon' },
    { name: 'Embeddings', href: '#', status: 'soon' },
    { name: 'Model Performance', href: '#', status: 'soon' },
    { name: 'API Playground', href: '#', status: 'soon' },
    { name: 'Docs', href: '#', status: 'soon' }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-screen overflow-y-auto z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:z-auto lg:flex-shrink-0
        w-64 bg-[#0B0C15] border-r border-white/5
      `}>
        <div className="p-6">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <RavenLogo className="w-7 h-7" />
              <span className="text-lg font-display font-bold text-white tracking-tight">RavenGraph</span>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                item.status === 'active'
                  ? 'bg-[#B066FF]/10 text-[#B066FF]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="font-sans">{item.name}</span>
              {item.status === 'soon' && (
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-zinc-500 border border-white/5 group-hover:border-white/10 transition-colors">
                  Soon
                </span>
              )}
            </a>
          ))}
        </nav>
        </div>
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#151725] to-[#0B0C15] border border-white/5">
            <div className="text-xs font-medium text-white mb-1">API Usage</div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mb-2 overflow-hidden">
              <div className="bg-[#B066FF] h-full w-3/4 rounded-full" />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>75k / 100k calls</span>
              <span>75%</span>
            </div>
          </div>
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

  return (
    <div className="min-h-screen bg-[#0B0C15] text-white font-sans selection:bg-[#B066FF]/30 overflow-hidden flex">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <GeometricParticleField className="opacity-20" />
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0 transition-all duration-300 relative z-10 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0B0C15]/80 backdrop-blur-md border-b border-white/5">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 text-zinc-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="font-display font-semibold text-lg tracking-tight">Market Intelligence</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search signals..."
                  className="pl-10 pr-4 py-2 w-64 rounded-full border border-white/10 bg-[#151725] text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:ring-1 focus:ring-[#B066FF]/50 transition-all"
                />
              </div>
              
              <button className="p-2 rounded-full hover:bg-white/5 transition-colors relative">
                <Bell className="w-5 h-5 text-zinc-400" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#B066FF] rounded-full border-2 border-[#0B0C15]" />
              </button>
              
              <div className="h-6 w-px bg-white/10" />
              
              <Button 
                onClick={handleLogout}
                variant="ghost" 
                className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full text-xs"
              >
                <LogOut className="w-3.5 h-3.5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-end justify-between"
            >
              <div>
                <h2 className="text-3xl font-display font-bold text-white mb-1">
                  Welcome back, Ralph
                </h2>
                <p className="text-zinc-400 font-light">
                  Market signals detected: <span className="text-emerald-400 font-medium">24 high confidence</span>
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 text-xs text-zinc-500 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                SYSTEM ONLINE • v2.4
              </div>
            </motion.div>

            {/* Hero Overview - Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Market Sentiment", value: "Bullish", sub: "+12% vs yesterday", icon: TrendingUp, color: "#10B981" },
                { label: "Volatility Regime", value: "Low", sub: "Stable conditions", icon: Activity, color: "#3B82F6" },
                { label: "Active Signals", value: "247", sub: "+18 new alerts", icon: Zap, color: "#B066FF" },
                { label: "Model Accuracy", value: "87.3%", sub: "30-day rolling", icon: Target, color: "#F59E0B" }
              ].map((metric, i) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="rounded-2xl border-white/5 bg-[#151725] hover:border-white/10 transition-all duration-300">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 rounded-xl bg-white/5">
                          <metric.icon className="w-5 h-5" style={{ color: metric.color }} />
                        </div>
                        <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider bg-white/5 px-2 py-1 rounded-md">
                          Live
                        </span>
                      </div>
                      <div>
                        <p className="text-2xl font-display font-bold text-white mb-1">{metric.value}</p>
                        <p className="text-sm text-zinc-400 font-medium mb-1">{metric.label}</p>
                        <p className="text-xs text-zinc-500 font-mono">{metric.sub}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Signals & Market Network */}
              <div className="lg:col-span-2 space-y-6">
                {/* Market Network Visualization */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card className="rounded-2xl border-white/5 bg-[#151725] overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-display font-bold text-white">Live Market Network</h3>
                          <p className="text-xs text-zinc-400">Real-time causal discovery graph</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium h-8 rounded-full">
                          <Network className="w-3.5 h-3.5 mr-2 text-[#B066FF]" />
                          Full Graph
                        </Button>
                      </div>
                      <MarketNetwork />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Buy/Sell/Neutral Signals */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <h3 className="text-lg font-display font-bold text-white mb-4 px-1">Probabilistic Feed</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {signals.map((signal, idx) => (
                      <motion.div
                        key={signal.ticker}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 + (idx * 0.05) }}
                      >
                        <SignalCard {...signal} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Daily Insights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Card className="rounded-2xl border-white/5 bg-[#151725]">
                    <CardContent className="p-6">
                      <h3 className="text-base font-display font-bold text-white mb-4">Daily Insights</h3>
                      <div className="space-y-3">
                        {[
                          { title: "Volatility Clustering", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/10", desc: "Energy sector clustering detected; correlation to Tech increasing." },
                          { title: "Lead-Lag Relationship", color: "text-[#B066FF]", bg: "bg-[#B066FF]/10", border: "border-[#B066FF]/10", desc: "Gold futures leading tech sector by ~3.5 minutes." },
                          { title: "Embedding Shift", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/10", desc: "Healthcare stocks moving from 'defensive' to 'growth' space." }
                        ].map((insight, i) => (
                          <div key={i} className={`p-4 rounded-xl ${insight.bg} border ${insight.border}`}>
                            <p className={`text-xs font-bold uppercase tracking-wide mb-1.5 ${insight.color}`}>{insight.title}</p>
                            <p className="text-xs text-zinc-300 leading-relaxed font-light">
                              {insight.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Portfolio Watchlist */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <Card className="rounded-2xl border-white/5 bg-[#151725]">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-display font-bold text-white">Watchlist</h3>
                        <Button
                            onClick={addToWatchlist}
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 rounded-full hover:bg-white/10"
                          >
                            <Plus className="w-4 h-4 text-zinc-400" />
                          </Button>
                      </div>
                      
                      <div className="relative mb-4">
                         <Input
                            value={newTicker}
                            onChange={(e) => setNewTicker(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addToWatchlist()}
                            placeholder="Add ticker..."
                            className="h-9 bg-[#0B0C15] border-white/5 text-xs rounded-lg placeholder:text-zinc-600 focus-visible:ring-[#B066FF]/50"
                          />
                      </div>

                      <div className="space-y-2">
                        {watchlist.map((ticker) => (
                          <div key={ticker} className="flex items-center justify-between p-3 rounded-lg bg-[#0B0C15] border border-white/5 hover:border-white/10 transition-colors group cursor-pointer">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-sm text-white">{ticker}</p>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              </div>
                              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Vol: Low • Sent: Bull</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-emerald-400 font-mono font-medium">+2.3%</p>
                              <p className="text-[10px] text-zinc-500">87% Prob.</p>
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
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Card className="rounded-2xl border-white/5 bg-[#151725]">
                    <CardContent className="p-6">
                      <h3 className="text-base font-display font-bold text-white mb-4">Quick API</h3>
                      <div className="space-y-2 font-mono text-[10px]">
                        {[
                          { method: "GET", path: "/signals", color: "text-emerald-400", bg: "bg-emerald-500/20" },
                          { method: "GET", path: "/embeddings", color: "text-blue-400", bg: "bg-blue-500/20" },
                          { method: "GET", path: "/correlations", color: "text-[#B066FF]", bg: "bg-[#B066FF]/20" },
                        ].map((api, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded bg-[#0B0C15] border border-white/5">
                             <span className="text-zinc-400">{api.path}</span>
                             <span className={`px-1.5 py-0.5 rounded ${api.bg} ${api.color} font-bold`}>{api.method}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-[10px] text-zinc-500 leading-relaxed">
                          Use your API key to stream these signals directly into your execution engine.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

              </div>
            </div>
          </div>
          
           {/* Footer */}
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-zinc-600 font-mono">
              <div className="flex items-center gap-2">
                 <RavenLogo className="w-4 h-4 opacity-50" />
                 <span>© 2025 RavenGraph Inc.</span>
              </div>
              <div className="flex gap-4">
                <span>SYSTEM: ONLINE</span>
                <span>LATENCY: 42ms</span>
              </div>
            </div>
        </main>
      </div>
    </div>
  );
}
