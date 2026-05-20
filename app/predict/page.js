"use client";
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Clock, Truck, FileText, AlertTriangle } from 'lucide-react';

// --- HOS Business Logic Engine ---
const calculateHOSLogs = (
  routeDurationHours,
  routeDistanceMiles,
  startCycleHours
) => {
  const logs = [];

  let day = 1;
  let currentHour = 0;

  let remainingDriveHours = routeDurationHours;
  let cycleHoursUsed = Number(startCycleHours) || 0;

  let availableDriveHours = 11;
  let availableShiftHours = 14;
  let availableBreakHours = 8;

  let milesSinceLastFuelStop = 0;
  const averageSpeed = 60;

  const addLog = (status, duration) => {
    let remainingDuration = duration;

    while (remainingDuration > 0) {
      const hoursLeftToday = 24 - currentHour;
      const segmentHours = Math.min(
        remainingDuration,
        hoursLeftToday
      );

      logs.push({
        day,
        startHour: currentHour,
        endHour: currentHour + segmentHours,
        status,
      });

      if (status === "drive") {
        availableDriveHours -= segmentHours;
        availableShiftHours -= segmentHours;
        availableBreakHours -= segmentHours;
        cycleHoursUsed += segmentHours;
      }

      if (status === "on") {
        availableShiftHours -= segmentHours;
        cycleHoursUsed += segmentHours;
      }

      currentHour += segmentHours;
      remainingDuration -= segmentHours;

      if (currentHour >= 24) {
        currentHour = 0;
        day++;
      }
    }
  };

  addLog("on", 1);

  while (remainingDriveHours > 0) {
    if (milesSinceLastFuelStop >= 900) {
      addLog("on", 0.5);
      milesSinceLastFuelStop = 0;
      continue;
    }

    if (cycleHoursUsed >= 70) {
      addLog("off", 34);

      cycleHoursUsed = 0;
      availableDriveHours = 11;
      availableShiftHours = 14;
      availableBreakHours = 8;

      continue;
    }

    if (
      availableDriveHours <= 0 ||
      availableShiftHours <= 0
    ) {
      addLog("sleeper", 10);

      availableDriveHours = 11;
      availableShiftHours = 14;
      availableBreakHours = 8;

      continue;
    }

    if (availableBreakHours <= 0) {
      addLog("off", 0.5);
      availableBreakHours = 8;
      continue;
    }

    const hoursUntilFuelStop =
      (1000 - milesSinceLastFuelStop) /
      averageSpeed;

    let drivingBlock = Math.min(
      remainingDriveHours,
      availableDriveHours,
      availableShiftHours,
      availableBreakHours,
      hoursUntilFuelStop,
      70 - cycleHoursUsed
    );

    if (drivingBlock < 0.01) {
      drivingBlock = 0.01;
    }

    addLog("drive", drivingBlock);

    remainingDriveHours -= drivingBlock;
    milesSinceLastFuelStop +=
      drivingBlock * averageSpeed;
  }

  addLog("on", 1);

  const groupedLogs = {};

  logs.forEach((log) => {
    if (!groupedLogs[log.day]) {
      groupedLogs[log.day] = [];
    }

    groupedLogs[log.day].push(log);
  });

  return groupedLogs;
};

const LogSheet = ({ dayNumber, logs }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    ctx.clearRect(
      0,
      0,
      canvasWidth,
      canvasHeight
    );

    const leftMargin = 80;
    const rightMargin = 40;
    const topMargin = 40;

    const gridWidth =
      canvasWidth - leftMargin - rightMargin;

    const rowHeight = 30;
    const hourWidth = gridWidth / 24;

    const statuses = [
      "off",
      "sleeper",
      "drive",
      "on",
    ];

    const labels = [
      "1. Off Duty",
      "2. Sleeper Berth",
      "3. Driving",
      "4. On Duty",
    ];

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#cbd5e1";
    ctx.fillStyle = "#0f172a";
    ctx.font = "10px Arial";

    ctx.fillRect(
      leftMargin,
      topMargin - 20,
      gridWidth,
      20
    );

    ctx.fillStyle = "#ffffff";

    ctx.fillText(
      "Midnight",
      leftMargin + 2,
      topMargin - 6
    );

    ctx.fillText(
      "Noon",
      leftMargin + 12 * hourWidth - 10,
      topMargin - 6
    );

    for (let hour = 1; hour <= 11; hour++) {
      ctx.fillText(
        hour,
        leftMargin + hour * hourWidth - 4,
        topMargin - 6
      );

      ctx.fillText(
        hour,
        leftMargin +
          (hour + 12) * hourWidth -
          4,
        topMargin - 6
      );
    }

    ctx.fillStyle = "#0f172a";

    for (let row = 0; row < 4; row++) {
      const y = topMargin + row * rowHeight;

      ctx.font = "bold 11px Arial";
      ctx.fillText(labels[row], 5, y + 18);

      ctx.beginPath();
      ctx.moveTo(leftMargin, y);
      ctx.lineTo(
        canvasWidth - rightMargin,
        y
      );
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(leftMargin, y + rowHeight);
      ctx.lineTo(
        canvasWidth - rightMargin,
        y + rowHeight
      );
      ctx.stroke();
    }

    for (let hour = 0; hour <= 24; hour++) {
      const x =
        leftMargin + hour * hourWidth;

      ctx.beginPath();
      ctx.moveTo(x, topMargin);
      ctx.lineTo(
        x,
        topMargin + rowHeight * 4
      );

      ctx.strokeStyle =
        hour % 12 === 0
          ? "#475569"
          : "#cbd5e1";

      ctx.stroke();

        if (hour < 24) {
            const halfHourX =
            x + hourWidth / 2;

            ctx.beginPath();
            ctx.setLineDash([2, 2]);

            ctx.moveTo(halfHourX, topMargin);
            ctx.lineTo(
            halfHourX,
            topMargin + rowHeight * 4
            );

            ctx.stroke();
            ctx.setLineDash([]);
        }
        }

        if (!logs?.length) return;

        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#ef4444";
        ctx.lineJoin = "round";

        let previousStatus = null;

        logs.forEach((log, index) => {
        const statusIndex =
            statuses.indexOf(log.status);

        const startX =
            leftMargin +
            log.startHour * hourWidth;

        const endX =
            leftMargin +
            log.endHour * hourWidth;

        const y =
            topMargin +
            statusIndex * rowHeight +
            rowHeight / 2;

        if (
            index > 0 &&
            previousStatus !== statusIndex
        ) {
            ctx.lineTo(startX, y);
        } else if (index === 0) {
            ctx.moveTo(startX, y);
        }

        ctx.lineTo(endX, y);

        previousStatus = statusIndex;
        });

        ctx.stroke();
    }, [logs]);

    return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-6 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-zinc-100">
            Driver Log - Day {dayNumber}
            </h3>

            <span className="px-3 py-1 text-sm rounded-full bg-zinc-800 text-zinc-400">
            Auto Generated
            </span>
        </div>

        <div className="bg-white rounded-lg p-2 min-w-[800px]">
            <canvas
            ref={canvasRef}
            width={800}
            height={180}
            className="w-full bg-white"
            />
        </div>
        </div>
    );
};
// --- Main Application ---
export default function App() {
    const [currentLoc, setCurrentLoc] = useState('');
    const [pickupLoc, setPickupLoc] = useState('');
    const [dropoffLoc, setDropoffLoc] = useState('');
    const [cycleHours, setCycleHours] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [routeData, setRouteData] = useState(null);
    const [generatedLogs, setGeneratedLogs] = useState(null);
    const [leafletReady, setLeafletReady] = useState(false);

    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const routeLayer = useRef(null);

  // Inject Leaflet dynamically
    useEffect(() => {
        if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
        }
    
        if (!window.L) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => setLeafletReady(true);
        document.head.appendChild(script);
        } else {
        setLeafletReady(true);
        }
    }, []);

  // Initialize Map when Leaflet is ready
    useEffect(() => {
        if (leafletReady && mapRef.current && !mapInstance.current) {
        mapInstance.current = window.L.map(mapRef.current).setView([39.8283, -98.5795], 4); // Center US
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance.current);
        }
    }, [leafletReady]);

    const geocode = async (query) => {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), name: query };
        }
        throw new Error(`Location not found: ${query}`);
    };

    const planTrip = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRouteData(null);
    setGeneratedLogs(null);

    try {
      // 1. Geocode locations
        const start = await geocode(currentLoc || pickupLoc); // If current empty, start at pickup
        const pickup = await geocode(pickupLoc);
        const dropoff = await geocode(dropoffLoc);

        // 2. Fetch Route from OSRM
        const coords = `${start.lon},${start.lat};${pickup.lon},${pickup.lat};${dropoff.lon},${dropoff.lat}`;
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
        
        const routeRes = await fetch(osrmUrl);
        const rData = await routeRes.json();

        if (rData.code !== 'Ok') throw new Error('Route calculation failed.');

        const routeInfo = rData.routes[0];
        const distanceMiles = routeInfo.distance * 0.000621371; // meters to miles
        const durationHours = routeInfo.duration / 3600; // seconds to hours

        setRouteData({
            distance: distanceMiles.toFixed(1),
            duration: durationHours.toFixed(1),
            waypoints: [start, pickup, dropoff]
        });

      // 3. Render Map
    if (mapInstance.current) {
        if (routeLayer.current) {
            mapInstance.current.removeLayer(routeLayer.current);
        }

        // Draw line
        const geojson = window.L.geoJSON(routeInfo.geometry, {
        style: { color: '#3b82f6', weight: 5, opacity: 0.7 }
        }).addTo(mapInstance.current);
        
        routeLayer.current = geojson;
        mapInstance.current.fitBounds(geojson.getBounds(), { padding: [50, 50] });

        // Add Markers
        window.L.marker([start.lat, start.lon], {title: 'Current/Start'}).addTo(mapInstance.current).bindPopup('Start');
        window.L.marker([pickup.lat, pickup.lon], {title: 'Pickup'}).addTo(mapInstance.current).bindPopup('Pickup');
        window.L.marker([dropoff.lat, dropoff.lon], {title: 'Dropoff'}).addTo(mapInstance.current).bindPopup('Dropoff');
    }

      // 4. Calculate HOS Logic
        const logs = calculateHOSLogs(durationHours, distanceMiles, cycleHours);
        setGeneratedLogs(logs);

    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-full min-h-screen bg-zinc-950 font-sans text-zinc-100">
      {/* Header */}
      <header className="bg-zinc-900 text-white px-6 py-4 shadow-md flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Truck className="text-blue-400" size={28} />
          <h1 className="text-xl font-bold tracking-tight">ELD Trip Planner <span className="text-slate-400 font-normal text-sm ml-2">v1.0.0</span></h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Clock size={16} />
          <span>70hr/8day Property</span>
        </div>
      </header>

      <main className="max-w-full mx-4 sm:mx-10 md:mx-20 my-10 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 bg-zinc-900 border border-zinc-800 shadow-xl">
        
        {/* Left Column: Form & Stats */}
        <div className="lg:col-span-4 max-w-full space-y-6">
          <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-850 shadow-inner">
            <h2 className="text-lg font-bold mb-6 text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Navigation className="text-blue-500 animate-pulse" size={24} />
              Dispatch Parameters
            </h2>
            
            <form onSubmit={planTrip} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-zinc-200 mb-1">Current Location (Optional)</label>
                <input 
                  type="text" 
                  value={currentLoc}
                  onChange={(e) => setCurrentLoc(e.target.value)}
                  placeholder="e.g., Chicago, IL"
                  className="w-full px-3 py-2 bg-zinc-900 text-zinc-100 placeholder-zinc-500 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-200 mb-1">Pickup Location *</label>
                <input 
                  type="text" 
                  required
                  value={pickupLoc}
                  onChange={(e) => setPickupLoc(e.target.value)}
                  placeholder="e.g., Dallas, TX"
                  className="w-full px-3 py-2 bg-zinc-900 text-zinc-100 placeholder-zinc-500 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-200 mb-1">Dropoff Location *</label>
                <input 
                  type="text" 
                  required
                  value={dropoffLoc}
                  onChange={(e) => setDropoffLoc(e.target.value)}
                  placeholder="e.g., Los Angeles, CA"
                  className="w-full px-3 py-2 bg-zinc-900 text-zinc-100 placeholder-zinc-500 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-200 mb-1">Cycle Hours Used (out of 70)</label>
                <input 
                  type="number" 
                  min="0"
                  max="70"
                  step="0.1"
                  required
                  value={cycleHours}
                  onChange={(e) => setCycleHours(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 text-zinc-100 placeholder-zinc-500 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-lg hover:shadow-blue-900/30"
              >
                {loading ? (
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                ) : (
                  <>Calculate Route & Logs</>
                )}
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-red-950 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3 border border-red-900/30">
              <AlertTriangle className="text-red-400 mt-0.5 flex-shrink-0" size={20} />
              <p className="text-red-200 text-sm font-medium">{error}</p>
            </div>
          )}

          {routeData && (
            <div className="bg-zinc-950 text-white p-6 rounded-xl shadow-lg border border-zinc-850">
              <h3 className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-4">Trip Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-xs">Total Distance</p>
                  <p className="text-2xl font-bold text-white">{routeData.distance} <span className="text-sm font-normal text-slate-400">mi</span></p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Est. Drive Time</p>
                  <p className="text-2xl font-bold text-blue-400">{routeData.duration} <span className="text-sm font-normal text-slate-400">hr</span></p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  <span className="text-slate-300 truncate font-medium">Start: {routeData.waypoints[0].name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <span className="text-slate-300 truncate font-medium">Pickup: {routeData.waypoints[1].name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span className="text-slate-300 truncate font-medium">Drop: {routeData.waypoints[2].name}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Map & Logs */}
        <div className="lg:col-span-8 space-y-8">
          {/* Map Container */}
          <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 shadow-inner h-[400px] relative z-0">
            {!leafletReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-10 rounded-xl">
                <span className="animate-pulse text-zinc-400 font-medium">Loading Map Engine...</span>
              </div>
            )}
            <div ref={mapRef} className="w-full h-full rounded-lg z-0"></div>
          </div>

          {/* Logs Container */}
          {generatedLogs && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2 mb-4">
                <FileText className="text-blue-500" />
                Generated Electronic Logs
              </h2>
              {Object.keys(generatedLogs).map(day => (
                <LogSheet key={day} dayNumber={day} logs={generatedLogs[day]} />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}