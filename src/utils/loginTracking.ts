import { supabase } from '../lib/supabase';

export const trackLoginHistory = async (userId: string) => {
  console.log('[LoginTrack] Function start for user:', userId);
  try {
    // 1. Get IP and Location
    let ipAddress = 'Unknown';
    let country = 'Unknown';
    let city = 'Unknown';
    
    try {
      console.log('[LoginTrack] Fetching public IP from ipify...');
      const ipRes = await fetch('https://api.ipify.org?format=json');
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        ipAddress = ipData.ip || 'Unknown';
        console.log('[LoginTrack] IP retrieved:', ipAddress);

        if (ipAddress !== 'Unknown') {
          console.log(`[LoginTrack] Looking up location for ${ipAddress} via ipwho.is...`);
          try {
            const geoRes = await fetch(`https://ipwho.is/${ipAddress}`);
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              console.log("[GeoLookup]", geoData);
              // ipwho.is returns 'country' and 'city' in the root or success object. 
              // Usually it's in the root of the JSON response for ipwho.is
              if (geoData.success) {
                country = geoData.country || 'Unknown';
                city = geoData.city || 'Unknown';
                console.log('[LoginTrack] Location retrieved:', { country, city });
              } else {
                console.warn('[LoginTrack] ipwho.is returned success: false', geoData.message);
              }
            }
          } catch (geoErr) {
            console.warn('[LoginTrack] Location lookup failed:', geoErr);
          }
        }
      } else {
        console.warn('[LoginTrack] ipify failed with status:', ipRes.status);
      }
    } catch (err) {
      console.warn('[LoginTrack] IP detection process failed:', err);
    }

    // 2. Parse User Agent
    const ua = navigator.userAgent;
    let browser = 'Unknown Browser';
    if (ua.includes('Firefox/')) browser = 'Firefox';
    else if (ua.includes('Edg/')) browser = 'Edge';
    else if (ua.includes('Chrome/') && !ua.includes('Edg/')) browser = 'Chrome';
    else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Safari';

    let os = 'Unknown OS';
    if (ua.includes('Windows NT 10.0')) os = 'Windows 10/11';
    else if (ua.includes('Windows NT')) os = 'Windows';
    else if (ua.includes('Mac OS X')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    if (ua.includes('Android')) os = 'Android';
    if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    let deviceType = 'Desktop';
    if (/Mobi|Android|iPhone/i.test(ua)) deviceType = 'Mobile';
    if (/Tablet|iPad/i.test(ua)) deviceType = 'Tablet';
    
    console.log('[LoginTrack] Browser details parsed:', { browser, os, deviceType });

    // 3. Check existing records
    console.log('[LoginTrack] Fetching existing login history from public.login_history...');
    const { data: existingRecords, error: fetchError } = await supabase
      .from('login_history')
      .select('*')
      .eq('user_id', userId)
      .order('last_seen', { ascending: false });

    if (fetchError) {
      console.error('[LoginTrack] Error fetching login history:', fetchError);
      return;
    }
    
    console.log('[LoginTrack] Existing records found:', existingRecords?.length || 0);

    let riskStatus = 'SAFE';
    let matchFound = false;

    if (existingRecords && existingRecords.length > 0) {
      // Find matching session
      const matchingRecord = existingRecords.find(r => r.ip_address === ipAddress && r.browser === browser && r.device_type === deviceType);

      if (matchingRecord) {
        console.log('[LoginTrack] Matching session found, updating ID:', matchingRecord.id);
        // Increment count and update last_seen
        const { error: updateError } = await supabase
          .from('login_history')
          .update({
            login_count: (matchingRecord.login_count || 1) + 1,
            last_seen: new Date().toISOString(),
          })
          .eq('id', matchingRecord.id);
          
        if (updateError) {
          console.error('[LoginTrack] Update result error:', updateError);
        } else {
          console.log('[LoginTrack] Update result success.');
        }
        matchFound = true;
      } else {
        console.log('[LoginTrack] No exact matching session found. Computing risk status...');
        // Compare with latest record for risk
        const latest = existingRecords[0];
        if (latest.country && latest.country !== 'Unknown' && country !== 'Unknown' && latest.country !== country) {
          riskStatus = 'HIGH_RISK';
        } else if (latest.ip_address !== ipAddress) {
          riskStatus = 'NEW_IP';
        } else if (latest.device_type !== deviceType || latest.browser !== browser) {
          riskStatus = 'NEW_DEVICE';
        }
        console.log('[LoginTrack] Risk status computed:', riskStatus);
      }
    }

    if (!matchFound) {
      console.log('[LoginTrack] No match found, inserting new record...');
      console.log('[LoginTrack] INSERT DATA PREVIEW:', {
          user_id: userId, ip_address: ipAddress, country, city, browser, os,
          device_type: deviceType, login_count: 1, risk_status: riskStatus
      });
      // Create new record
      const { error: insertError } = await supabase
        .from('login_history')
        .insert([{
          user_id: userId,
          ip_address: ipAddress,
          country: country,
          city: city,
          browser: browser,
          os: os,
          device_type: deviceType,
          login_count: 1,
          risk_status: riskStatus,
          first_seen: new Date().toISOString(),
          last_seen: new Date().toISOString()
        }]);
        
      if (insertError) {
        console.error('[LoginTrack] INSERT result error:', insertError);
      } else {
        console.log('[LoginTrack] INSERT result success.');
      }
    }
    
    console.log('[LoginTrack] Function complete.');
  } catch(e) {
    console.error('[LoginTrack] Catch block error tracking login history:', e);
  }
};
