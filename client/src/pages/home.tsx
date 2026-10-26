import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const COPYRIGHT_TEXT = `
Copyright (c) 2024 Ian Victor Joseph Murray imurray@yahoo.com
Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License

This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0
International License. To view a copy of this license, visit:
http://creativecommons.org/licenses/by-nc-sa/4.0/

You are free to:
* Share — copy and redistribute the material in any medium or format
* Adapt — remix, transform, and build upon the material

Under the following terms:
* Attribution — You must give appropriate credit, provide a link to the license,
  and indicate if changes were made.
* NonCommercial — You may not use the material for commercial purposes.
* ShareAlike — If you remix, transform, or build upon the material, you must
  distribute your contributions under the same license as the original.
`;

const MembranePotentialSimulator = () => {
  // Constants
  const PUMP_RATE = 0.1;
  const LEAK_RATE = 0.05;
  
  // Physiological permeability constants (relative values)
  const P_K_BASE = 1.0;        // Base K+ permeability
  const P_NA_BASE = 0.04;      // Base Na+ permeability (much lower than K+)
  const P_CL_BASE = 0.45;      // Base Cl- permeability
  
  // Chloride concentrations (relatively constant)
  const CL_IN = 10;   // mM
  const CL_OUT = 110; // mM
  
  const [pumpActive, setPumpActive] = useState(true);
  const [leakChannelOpen, setLeakChannelOpen] = useState(true);
  const [intracellularK, setIntracellularK] = useState(140);
  const [extracellularK, setExtracellularK] = useState(4);
  const [intracellularNa, setIntracellularNa] = useState(15);
  const [extracellularNa, setExtracellularNa] = useState(145);
  const [membranePotential, setMembranePotential] = useState(-70);
  const [time, setTime] = useState(0);
  const potentialHistory = useRef<{ time: number; potential: number }[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphRef = useRef<HTMLCanvasElement>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const animationFrameRef = useRef<number>();

  const resetToDefaults = () => {
    setPumpActive(true);
    setLeakChannelOpen(true);
    setIntracellularK(140);
    setExtracellularK(4);
    setIntracellularNa(15);
    setExtracellularNa(145);
    setTime(0);
    potentialHistory.current = [];
  };

  const calculatePotential = () => {
    // Nernst equation for K+ at body temperature (37°C)
    // E_K = 26.7 * ln([K+]out / [K+]in)
    const E_K = 26.7 * Math.log(extracellularK / intracellularK);
    
    // Dynamic scaling factors based on pump and channel states
    let scaling = 0.77; // Normal K+ dominance
    
    if (!pumpActive && !leakChannelOpen) {
      scaling = 0.48; // Combined effect
    } else if (!pumpActive) {
      scaling = 0.75; // Small pump effect (~2-3 mV)
    } else if (!leakChannelOpen) {
      scaling = 0.50; // Major K+ channel effect (depolarization)
    }
    
    // Final membrane potential
    const potential = E_K * scaling;
    
    return potential;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (pumpActive) {
        setIntracellularK(prev => {
          const target = 140;
          const newValue = prev + (target - prev) * PUMP_RATE;
          return newValue;
        });
        setIntracellularNa(prev => {
          const target = 15;
          const newValue = prev + (target - prev) * PUMP_RATE;
          return newValue;
        });
      } else if (leakChannelOpen) {
        setIntracellularK(prev => {
          const newValue = prev - (prev - extracellularK) * LEAK_RATE;
          return Math.max(newValue, extracellularK);
        });
        setIntracellularNa(prev => {
          const newValue = prev + (extracellularNa - prev) * LEAK_RATE;
          return Math.min(newValue, extracellularNa);
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, [pumpActive, extracellularK, extracellularNa, leakChannelOpen]);

  useEffect(() => {
    const potential = calculatePotential();
    setMembranePotential(potential);
    
    potentialHistory.current.push({ 
      time, 
      potential
    });
    
    if (potentialHistory.current.length > 100) {
      potentialHistory.current.shift();
    }
  }, [intracellularK, extracellularK, leakChannelOpen, pumpActive, time]);

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 1), 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (canvasRef.current && graphRef.current) {
      setIsCanvasReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isCanvasReady) return;

    const canvas = canvasRef.current;
    const graph = graphRef.current;
    
    if (!canvas || !graph) return;

    const ctx = canvas.getContext('2d');
    const gtx = graph.getContext('2d');
    
    if (!ctx || !gtx) return;
    
    // Handle canvas scaling for mobile
    const handleResize = () => {
      const containers = document.querySelectorAll('canvas');
      containers.forEach(canvas => {
        const container = canvas.parentElement;
        if (container) {
          const containerWidth = container.offsetWidth;
          const maxWidth = Math.min(400, containerWidth - 40); // 20px padding on each side
          canvas.style.width = maxWidth + 'px';
          canvas.style.height = (canvas.height * maxWidth / canvas.width) + 'px';
        }
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    const drawCell = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Scale based on canvas display size
      const scale = Math.min(canvas.offsetWidth / canvas.width, 1);
      const fontSize = Math.max(10, 12 * scale);
      const largeFontSize = Math.max(11, 14 * scale);
      
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 50, 300, 200);
      
      ctx.fillStyle = 'rgba(200, 200, 255, 0.2)';
      ctx.fillRect(50, 50, 300, 200);
      ctx.fillStyle = 'rgba(255, 200, 200, 0.2)';
      ctx.fillRect(0, 0, canvas.width, 50);
      
      // Na+/K+ pump 
      ctx.beginPath();
      ctx.arc(200, 50, 15, 0, 2 * Math.PI);
      ctx.strokeStyle = pumpActive ? '#4CAF50' : '#999';
      ctx.lineWidth = 3;
      ctx.stroke();
      if (pumpActive) {
        ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
        ctx.fill();
      }
      ctx.fillStyle = '#000';
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('Na+/K+ ATPase', 200, 85);
      
      // Ion concentrations (only K+ and Na+)
      ctx.textAlign = 'left';
      ctx.font = `bold ${largeFontSize}px Arial`;
      ctx.fillStyle = '#000';
      ctx.fillText(`[K+]in = ${intracellularK.toFixed(1)} mM`, 60, 130);
      ctx.fillText(`[Na+]in = ${intracellularNa.toFixed(1)} mM`, 60, 145);
      
      ctx.fillText(`[K+]out = ${extracellularK.toFixed(1)} mM`, 60, 20);
      ctx.fillText(`[Na+]out = ${extracellularNa.toFixed(1)} mM`, 60, 35);

      // K+ leak channel - moved left to avoid boundary overlap
      ctx.fillStyle = leakChannelOpen ? '#2196F3' : '#999';
      ctx.fillRect(285, 45, 12, 20);
      if (leakChannelOpen) {
        ctx.fillStyle = 'rgba(33, 150, 243, 0.3)';
        ctx.fillRect(283, 43, 16, 24);
      }
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillText('K+ leak channel', 290, 85);
    };

    const drawGraph = () => {
      gtx.clearRect(0, 0, graph.width, graph.height);
      
      // Scale based on canvas display size
      const scale = Math.min(graph.offsetWidth / graph.width, 1);
      const fontSize = Math.max(9, 12 * scale);
      
      gtx.beginPath();
      gtx.strokeStyle = '#000';
      gtx.lineWidth = 2;
      gtx.moveTo(50, 30);
      gtx.lineTo(50, graph.height - 30);
      gtx.lineTo(graph.width - 30, graph.height - 30);
      gtx.stroke();
      
      gtx.font = `${fontSize}px Arial`;
      gtx.textAlign = 'right';
      const voltages = [0, -20, -40, -60, -80, -100];
      voltages.forEach(v => {
        const y = 30 + ((0 - v) / 100) * (graph.height - 60);
        gtx.fillStyle = '#000';
        gtx.fillText(`${v}`, 45, y);
        
        gtx.beginPath();
        gtx.strokeStyle = '#ddd';
        gtx.lineWidth = 1;
        gtx.moveTo(50, y);
        gtx.lineTo(graph.width - 30, y);
        gtx.stroke();
      });
      
      gtx.beginPath();
      gtx.strokeStyle = '#FF0000';
      gtx.lineWidth = 2;
      gtx.setLineDash([5, 5]);
      const yRMP = 30 + ((0 - (-73)) / 100) * (graph.height - 60); // -73 mV normal RMP
      gtx.moveTo(50, yRMP);
      gtx.lineTo(graph.width - 30, yRMP);
      gtx.stroke();
      gtx.setLineDash([]);
      gtx.textAlign = 'left';
      gtx.fillStyle = '#000';
      gtx.fillText(`-73 mV (Normal RMP)`, Math.min(200, graph.width * 0.5), yRMP + 15); // Below line
      
      // Threshold potential line
      gtx.beginPath();
      gtx.strokeStyle = '#FF6600';
      gtx.lineWidth = 2;
      gtx.setLineDash([3, 3]);
      const yThreshold = 30 + ((0 - (-55)) / 100) * (graph.height - 60); // -55 mV threshold
      gtx.moveTo(50, yThreshold);
      gtx.lineTo(graph.width - 30, yThreshold);
      gtx.stroke();
      gtx.setLineDash([]);
      gtx.fillStyle = '#FF6600';
      gtx.fillText(`-55 mV (Threshold)`, Math.min(200, graph.width * 0.5), yThreshold - 5); // Above line
      
      if (potentialHistory.current.length > 0) {
        gtx.beginPath();
        gtx.strokeStyle = '#2196F3';
        gtx.lineWidth = 3;
        potentialHistory.current.forEach((point, i) => {
          const x = 50 + (i / potentialHistory.current.length) * (graph.width - 80);
          // Clamp to the plotted 0 to -100 mV window so the trace never leaves the axes
          const v = Math.max(-100, Math.min(0, point.potential));
          const y = 30 + ((0 - v) / 100) * (graph.height - 60);
          if (i === 0) gtx.moveTo(x, y);
          else gtx.lineTo(x, y);
        });
        gtx.stroke();
      }
    };
    
    const animate = () => {
      drawCell();
      drawGraph();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isCanvasReady, pumpActive, leakChannelOpen, intracellularK, extracellularK, 
      intracellularNa, extracellularNa, membranePotential]);

  return (
    <div className="w-full max-w-4xl mx-auto p-1 sm:p-2 space-y-2 pb-4">
      <Card>
        <CardContent className="p-2 sm:p-3">
          <div className="space-y-2 sm:space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={300}
                  className="border border-gray-200 rounded bg-white max-w-full h-auto"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                <div className="text-center text-xs text-gray-600 mt-2">
                  Created by Ian Murray, Creative Commons copyright: CC BY-NC-SA
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Membrane Potential</h3>
                <canvas
                  ref={graphRef}
                  width={400}
                  height={200}
                  className="border border-gray-200 rounded bg-white max-w-full h-auto"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mt-4">
              <Button 
                onClick={() => setPumpActive(!pumpActive)}
                className={`${pumpActive ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} 
                           px-3 py-2 text-xs sm:text-sm min-h-[36px] touch-manipulation`}
              >
                {pumpActive ? 'Turn Pump Off' : 'Turn Pump On'}
              </Button>
              <Button 
                onClick={() => setLeakChannelOpen(!leakChannelOpen)}
                className={`${leakChannelOpen ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'} 
                           px-3 py-2 text-xs sm:text-sm min-h-[36px] touch-manipulation`}
              >
                {leakChannelOpen ? 'Close K+ Channel' : 'Open K+ Channel'}
              </Button>
              <Button 
                onClick={resetToDefaults}
                className="bg-purple-600 hover:bg-purple-700 px-3 py-2 text-xs sm:text-sm min-h-[36px] touch-manipulation text-white"
              >
                Reset All
              </Button>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Ion Concentration Controls</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <label className="block mb-1 text-xs sm:text-sm font-medium">
                      Intracellular [K+] (mM): {intracellularK.toFixed(1)}
                    </label>
                    <div className="px-1 py-1">
                      <Slider
                        value={[intracellularK]}
                        onValueChange={([value]) => setIntracellularK(value)}
                        min={1}
                        max={140}
                        step={1}
                        className="touch-manipulation cursor-pointer"
                        style={{ touchAction: 'none' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs sm:text-sm font-medium">
                      Extracellular [K+] (mM): {extracellularK.toFixed(1)}
                    </label>
                    <div className="px-1 py-1">
                      <Slider
                        value={[extracellularK]}
                        onValueChange={([value]) => setExtracellularK(value)}
                        min={1}
                        max={10}
                        step={0.1}
                        className="touch-manipulation cursor-pointer"
                        style={{ touchAction: 'none' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border p-2 sm:p-3 rounded">
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Membrane Properties</h3>
                <p className="text-xs sm:text-sm mb-1">
                  Current membrane potential: <span className="font-bold">{membranePotential.toFixed(1)} mV</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Membrane Potential Simulator</h1>
          <p className="text-gray-600">Interactive Cellular Electrophysiology Tool</p>
        </div>
        <MembranePotentialSimulator />
      </div>
    </div>
  );
}
