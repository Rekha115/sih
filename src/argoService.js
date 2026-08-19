// FloatChat ARGO Data Service Abstraction Layer
// This file acts as the single data layer for the application.
// A real NetCDF pipeline or NetCDF API can drop in and replace this service.

export const argoService = {
  // Get active float markers for the geospatial map
  getFloatObservations: (region = 'Arabian Sea', parameter = 'temperature', date = 'January 2025') => {
    // Generate realistic, consistent simulated floats
    if (region === 'Arabian Sea') {
      return [
        { id: 'Demo-290001', lat: 18.42, lng: 67.81, temp: 24.8, salinity: 35.8, depth: 500, date },
        { id: 'Demo-290002', lat: 14.15, lng: 70.32, temp: 26.1, salinity: 36.1, depth: 500, date },
        { id: 'Demo-290003', lat: 19.50, lng: 64.20, temp: 23.5, salinity: 35.9, depth: 500, date },
        { id: 'Demo-290004', lat: 21.10, lng: 68.90, temp: 25.2, salinity: 36.0, depth: 500, date },
        { id: 'Demo-290005', lat: 16.80, lng: 62.50, temp: 24.1, salinity: 35.7, depth: 500, date },
        { id: 'Demo-290006', lat: 12.20, lng: 65.10, temp: 25.9, salinity: 36.0, depth: 500, date },
        { id: 'Demo-290007', lat: 15.45, lng: 68.12, temp: 24.9, salinity: 35.6, depth: 500, date }
      ];
    } else if (region === 'Bay of Bengal') {
      return [
        { id: 'Demo-290101', lat: 17.50, lng: 88.20, temp: 27.2, salinity: 33.1, depth: 500, date },
        { id: 'Demo-290102', lat: 15.10, lng: 85.40, temp: 26.8, salinity: 33.4, depth: 500, date },
        { id: 'Demo-290103', lat: 19.20, lng: 89.90, temp: 25.9, salinity: 32.8, depth: 500, date },
        { id: 'Demo-290104', lat: 12.30, lng: 82.10, temp: 27.5, salinity: 33.8, depth: 500, date }
      ];
    }
    return [];
  },

  // Get vertical depth profiles (X: Depth in meters, Y: Parameter value)
  getDepthProfileData: (region = 'Arabian Sea', parameter = 'temperature') => {
    // Return vertical profile coordinates (X: Depth, Y: Value)
    const points = [];
    const step = 50;
    
    for (let depth = 0; depth <= 500; depth += step) {
      let val = 0;
      if (parameter === 'temperature') {
        // Temperature decreases with depth
        // Surface: ~28C, thermocline decrease, 500m: ~16C
        if (region === 'Arabian Sea') {
          // Warm anomaly in Arabian Sea
          const baselineTemp = 28 - (depth / 50) * 1.15;
          const currentTemp = depth >= 300 && depth <= 500 
            ? baselineTemp + 1.2 
            : baselineTemp + (depth / 500) * 0.2;
          val = { depth, current: parseFloat(currentTemp.toFixed(1)), baseline: parseFloat(baselineTemp.toFixed(1)) };
        } else {
          // Bay of Bengal has nominal temp profile
          const baselineTemp = 28.5 - (depth / 50) * 1.2;
          val = { depth, current: parseFloat((baselineTemp + 0.3).toFixed(1)), baseline: parseFloat(baselineTemp.toFixed(1)) };
        }
      } else {
        // Salinity profile: PSU values
        // Arabian sea: ~36.2 PSU, Bay of Bengal: ~33.0 PSU
        if (region === 'Arabian Sea') {
          const baselineSalinity = 36.2 - (depth / 500) * 0.3;
          const currentSalinity = depth >= 300 && depth <= 500
            ? baselineSalinity - 0.4
            : baselineSalinity;
          val = { depth, current: parseFloat(currentSalinity.toFixed(2)), baseline: parseFloat(baselineSalinity.toFixed(2)) };
        } else {
          const baselineSalinity = 33.2 - (depth / 500) * 0.4;
          val = { depth, current: parseFloat((baselineSalinity - 0.1).toFixed(2)), baseline: parseFloat(baselineSalinity.toFixed(2)) };
        }
      }
      points.push(val);
    }
    return points;
  },

  // Get prediction time-series trend (Past ➔ Today ➔ Forecast)
  getForecastData: (region = 'Arabian Sea', parameter = 'temperature') => {
    // 6 data points: -30 Days, -15 Days, Today, +7 Days, +15 Days, +30 Days
    const timelines = ['30 Days Ago', '15 Days Ago', 'Today', '+7 Days', '+15 Days', '+30 Days'];
    if (parameter === 'temperature') {
      return [
        { label: '30 Days Ago', val: 0.8, type: 'historical' },
        { label: '15 Days Ago', val: 1.0, type: 'historical' },
        { label: 'Today', val: 1.2, type: 'today' },
        { label: '+7 Days', val: 1.3, type: 'forecast', min: 1.0, max: 1.6 },
        { label: '+15 Days', val: 1.4, type: 'forecast', min: 0.9, max: 1.8 },
        { label: '+30 Days', val: 1.3, type: 'forecast', min: 0.7, max: 1.9 }
      ];
    } else {
      return [
        { label: '30 Days Ago', val: -0.2, type: 'historical' },
        { label: '15 Days Ago', val: -0.3, type: 'historical' },
        { label: 'Today', val: -0.4, type: 'today' },
        { label: '+7 Days', val: -0.4, type: 'forecast', min: -0.55, max: -0.25 },
        { label: '+15 Days', val: -0.35, type: 'forecast', min: -0.6, max: -0.1 },
        { label: '+30 Days', val: -0.3, type: 'forecast', min: -0.7, max: 0.1 }
      ];
    }
  },

  // Get AI Insight text based on selections
  getAIInsight: (region = 'Arabian Sea', parameter = 'temperature', isSimple = false) => {
    if (parameter === 'temperature') {
      if (isSimple) {
        return {
          main: "In simple terms, the ocean is warmer near the surface and becomes cooler as depth increases. However, the water between 300 and 500 meters is currently warmer than what we normally expect in this area.",
          findings: [
            "Surface water is comparatively warmer",
            "Temperature decreases as the depth increases",
            "The largest temp difference occurs at intermediate depths",
            "Findings are based on 128 active float profiles in the Arabian Sea"
          ]
        };
      } else {
        return {
          main: "Temperature decreases with increasing depth, with the strongest variation occurring in the upper ocean layer. An anomalous warming peak of +1.2°C is detected between 300–500m.",
          findings: [
            "Surface mixing layer is comparatively warmer",
            "Temperature decreases monotonically with depth",
            "Strongest anomaly variation occurs in intermediate thermocline layers",
            "Analysis is based on selected ARGO observations"
          ]
        };
      }
    } else {
      // Salinity
      if (isSimple) {
        return {
          main: "In simple terms, the salinity (salt content) of the water changes with depth. At 300 to 500 meters down, the water is currently fresher (less salty) than usual.",
          findings: [
            "Upper ocean has a steady salt concentration",
            "Salinity drops below typical levels in the mid-depths",
            "The freshwater anomaly suggests shifts in ocean currents",
            "Findings are based on 128 active float profiles in the Arabian Sea"
          ]
        };
      } else {
        return {
          main: "Salinity profile shows a negative anomaly (-0.4 PSU) concentrated at the 300-500m layer. Surface salinity remains nominal at 35.8 PSU.",
          findings: [
            "Upper halocline layer displays stable saline values",
            "Intermediate salinity drops below seasonal mean thresholds",
            "Negative anomaly points to localized freshening of intermediate water masses",
            "Analysis is based on selected ARGO observations"
          ]
        };
      }
    }
  }
};
