import { Scenario } from "../types";

export const scenarios: Scenario[] = [
  {
    id: "crc-spike",
    name: "CRC Errors + CPU Spike",
    mission_status: "Satellite Launch (PSLV-C60)",
    initial_telemetry: { "Packet Loss": "0%", "CPU": "35%", "CRC Errors": "0/sec", "Latency": "12ms" },
    degraded_telemetry: { "Packet Loss": "3.2%", "CPU": "95%", "CRC Errors": "500/sec", "Latency": "85ms" },
    recovered_telemetry: { "Packet Loss": "0%", "CPU": "55%", "CRC Errors": "0/sec", "Latency": "18ms" },
    prediction: {
      issue: "Interface Gi0/1 degradation",
      eta: "18 minutes",
      confidence: "93%",
      severity: "CRITICAL"
    },
    evidence: {
      "CRC Errors": "500 errors/sec ↑",
      "CPU Utilization": "95%",
      "Interface Flapping": "7 events in last 4 min",
      "BGP Stability": "Stable"
    },
    root_cause: {
      primary_hypothesis: "Faulty SFP / Fiber on primary core link",
      alternative_causes: ["Duplex mismatch", "Failing interface ASIC"]
    },
    affected_scope: {
      router: "CORE-RTR-01",
      interface: "Gi0/1",
      sites: ["Launch-Pad-2", "Telemetry-Base"],
      services: ["MPLS VPN A (Telemetry)"],
      impact: "HIGH"
    },
    recommended_actions: {
      immediate: ["Verify fiber integrity", "Replace SFP", "Check duplex"],
      if_unresolved: ["Shift traffic to backup path", "Open hardware ticket"]
    },
    cli_commands: [
      "show interfaces Gi0/1",
      "show interfaces counters errors",
      "show controllers Gi0/1"
    ],
    shap_evidence: {
      "CPU Utilization": "+41%",
      "CRC Errors": "+33%",
      "Queue Length": "+12%",
      "Interface Flaps": "+8%"
    },
    historical_incident: {
      incident_id: "Incident #142",
      resolved_by: "Replacing faulty SFP.",
      similarity: "96%"
    },
    recovery_toast: "Traffic successfully rerouted through Backup MPLS Path."
  },
  {
    id: "bgp-flap",
    name: "BGP Route Flapping",
    mission_status: "Earth Observation (Cartosat)",
    initial_telemetry: { "BGP State": "ESTAB", "Prefixes": "4500", "CPU": "40%", "Latency": "10ms" },
    degraded_telemetry: { "BGP State": "IDLE/ACTIVE", "Prefixes": "0", "CPU": "75%", "Latency": "Timeout" },
    recovered_telemetry: { "BGP State": "ESTAB", "Prefixes": "4500", "CPU": "42%", "Latency": "11ms" },
    prediction: {
      issue: "BGP Session Reset on Edge Router",
      eta: "2 minutes",
      confidence: "88%",
      severity: "CRITICAL"
    },
    evidence: {
      "BGP State": "Flapping (4 times/hour)",
      "Hold Timer": "Expired",
      "Keepalives": "Missed 3 consecutive",
      "Prefix Churn": "High"
    },
    root_cause: {
      primary_hypothesis: "MTU Mismatch causing keepalive drops",
      alternative_causes: ["ISP Routing Loop", "Control Plane Policing (CoPP) blocking TCP 179"]
    },
    affected_scope: {
      router: "EDGE-RTR-04",
      interface: "Te0/0/2",
      sites: ["Data-Archive", "Ground-Station-Alpha"],
      services: ["Internet Transit", "B2B Peerings"],
      impact: "HIGH"
    },
    recommended_actions: {
      immediate: ["Verify interface MTU", "Check CoPP counters for TCP 179 drops", "Trace path to neighbor"],
      if_unresolved: ["Soft clear BGP session", "Rollback recent ACL changes"]
    },
    cli_commands: [
      "show ip bgp neighbors x.x.x.x",
      "show policy-map control-plane",
      "ping x.x.x.x size 1500 df-bit"
    ],
    shap_evidence: {
      "Keepalive Drops": "+55%",
      "Hold Timer Expired": "+25%",
      "MTU Size Delta": "+15%"
    },
    historical_incident: {
      incident_id: "Incident #089",
      resolved_by: "Correcting MTU on provider-facing interface.",
      similarity: "91%"
    },
    recovery_toast: "BGP Session Restored. Route propagation active."
  },
  {
    id: "mpls-congestion",
    name: "MPLS Congestion",
    mission_status: "Routine Operations",
    initial_telemetry: { "Tunnel Util": "45%", "Queue Drops": "0", "Jitter": "2ms", "Latency": "15ms" },
    degraded_telemetry: { "Tunnel Util": "99%", "Queue Drops": "450/sec", "Jitter": "45ms", "Latency": "250ms" },
    recovered_telemetry: { "Tunnel Util": "60%", "Queue Drops": "0", "Jitter": "3ms", "Latency": "18ms" },
    prediction: {
      issue: "MPLS TE Tunnel Exhaustion",
      eta: "Immediate",
      confidence: "95%",
      severity: "HIGH"
    },
    evidence: {
      "Tunnel Utilization": "99% (Sustained)",
      "Tail Drops": "Increasing rapidly",
      "Latency": "Spiked to 250ms",
      "QoS Class": "Expedited Forwarding dropping"
    },
    root_cause: {
      primary_hypothesis: "Unplanned massive data replication job",
      alternative_causes: ["DDoS Attack", "Misconfigured RSVP Bandwidth"]
    },
    affected_scope: {
      router: "PE-RTR-01",
      interface: "Tunnel100",
      sites: ["DC-Primary", "DC-Secondary"],
      services: ["Storage Sync", "VoIP"],
      impact: "MEDIUM"
    },
    recommended_actions: {
      immediate: ["Identify top talkers on interface", "Verify QoS policy maps", "Engage storage team"],
      if_unresolved: ["Provision additional TE tunnel", "Apply temporary rate-limit"]
    },
    cli_commands: [
      "show mpls traffic-eng tunnels brief",
      "show policy-map interface Tunnel100",
      "monitor interface Tunnel100 top-talkers"
    ],
    shap_evidence: {
      "Tunnel Util": "+60%",
      "Queue Drops": "+20%",
      "Jitter": "+15%"
    },
    historical_incident: {
      incident_id: "Incident #211",
      resolved_by: "Rate-limiting backup job to 2Gbps.",
      similarity: "88%"
    },
    recovery_toast: "Traffic dynamically balanced across secondary MPLS LSP."
  },
  {
    id: "sdwan-degradation",
    name: "SD-WAN Tunnel Degradation",
    mission_status: "Deep Space Mission (Gaganyaan Ground Support)",
    initial_telemetry: { "Packet Loss": "0%", "Latency": "12ms", "Jitter": "1ms", "Tunnel State": "UP" },
    degraded_telemetry: { "Packet Loss": "15%", "Latency": "350ms", "Jitter": "50ms", "Tunnel State": "DEGRADED" },
    recovered_telemetry: { "Packet Loss": "0%", "Latency": "14ms", "Jitter": "2ms", "Tunnel State": "UP" },
    prediction: {
      issue: "SD-WAN Path Quality Brownout",
      eta: "5 minutes",
      confidence: "90%",
      severity: "CRITICAL"
    },
    evidence: {
      "Underlay Transport": "High Loss on INET-1",
      "SLA Class": "Mission-Critical SLA breached",
      "Application Performance": "Degraded",
      "IPSec SA": "Stable"
    },
    root_cause: {
      primary_hypothesis: "ISP routing issue in the middle-mile",
      alternative_causes: ["Carrier link saturated", "Local WAN port error"]
    },
    affected_scope: {
      router: "SDWAN-EDGE-HQ",
      interface: "GigabitEthernet0/0/0 (INET)",
      sites: ["HQ", "Remote-Observatory"],
      services: ["Telemetry Feed", "Control Plane"],
      impact: "HIGH"
    },
    recommended_actions: {
      immediate: ["Force traffic to LTE/MPLS transport", "Open ticket with ISP", "Verify local WAN handoff"],
      if_unresolved: ["Disable failing WAN interface entirely to force failover"]
    },
    cli_commands: [
      "show sdwan app-route stats",
      "show sdwan bfd sessions",
      "show sdwan policy from-vsmart"
    ],
    shap_evidence: {
      "SLA Breach": "+45%",
      "INET-1 Loss": "+35%",
      "Jitter Spike": "+10%"
    },
    historical_incident: {
      incident_id: "Incident #305",
      resolved_by: "Manual override of app-route policy to force MPLS.",
      similarity: "94%"
    },
    recovery_toast: "SD-WAN controller forced Application Traffic to MPLS underlay."
  },
  {
    id: "route-leak",
    name: "Route Leak",
    mission_status: "Routine Operations",
    initial_telemetry: { "Routing Table Size": "10k", "CPU": "20%", "Traffic Anomaly": "Low" },
    degraded_telemetry: { "Routing Table Size": "850k", "CPU": "98%", "Traffic Anomaly": "Critical" },
    recovered_telemetry: { "Routing Table Size": "10k", "CPU": "25%", "Traffic Anomaly": "Low" },
    prediction: {
      issue: "BGP Full Route Leak into IGP",
      eta: "Immediate",
      confidence: "98%",
      severity: "CRITICAL"
    },
    evidence: {
      "OSPF LSDB": "Massive increase in Type 5 ASBR LFAs",
      "Router CPU": "Spiked to 98% due to SPF calculations",
      "Memory": "Approaching exhaustion limit",
      "Traffic": "Suboptimal routing observed"
    },
    root_cause: {
      primary_hypothesis: "Missing prefix-list on BGP to OSPF redistribution",
      alternative_causes: ["Misconfigured route-map", "Operator error during change window"]
    },
    affected_scope: {
      router: "CORE-DIST-01",
      interface: "Routing Process OSPF 1",
      sites: ["Entire Enterprise Backbone"],
      services: ["All Internal Routing"],
      impact: "CRITICAL"
    },
    recommended_actions: {
      immediate: ["Kill BGP session to edge", "Remove redistribution command", "Clear OSPF process"],
      if_unresolved: ["Reboot router to clear memory if unresponsive"]
    },
    cli_commands: [
      "show ip ospf database summary",
      "show running-config | section router ospf",
      "clear ip ospf process"
    ],
    shap_evidence: {
      "LSDB Size": "+60%",
      "CPU SPF": "+30%",
      "Memory Util": "+8%"
    },
    historical_incident: {
      incident_id: "Incident #012",
      resolved_by: "Applied prefix-list blocking default route and internet ranges.",
      similarity: "99%"
    },
    recovery_toast: "Redistribution blocked. OSPF process cleared and converged."
  },
  {
    id: "controller-misconfig",
    name: "Controller Misconfiguration",
    mission_status: "Earth Observation",
    initial_telemetry: { "Config Sync": "IN-SYNC", "VLANs": "Valid", "API Errors": "0" },
    degraded_telemetry: { "Config Sync": "OUT-OF-SYNC", "VLANs": "Missing", "API Errors": "45/min" },
    recovered_telemetry: { "Config Sync": "IN-SYNC", "VLANs": "Valid", "API Errors": "0" },
    prediction: {
      issue: "SDN Controller Configuration Drift",
      eta: "10 minutes",
      confidence: "85%",
      severity: "MEDIUM"
    },
    evidence: {
      "Netconf Sessions": "Failing authentication",
      "Template": "Mismatch detected on switch SW-ACCESS-05",
      "VLAN Status": "VLAN 200 removed unexpectedly"
    },
    root_cause: {
      primary_hypothesis: "Unauthorized manual CLI change overriding SDN controller",
      alternative_causes: ["Controller sync bug", "Stale template pushed"]
    },
    affected_scope: {
      router: "SW-ACCESS-05",
      interface: "Multiple Access Ports",
      sites: ["Campus Building A"],
      services: ["User Access", "IoT Sensors"],
      impact: "MEDIUM"
    },
    recommended_actions: {
      immediate: ["Force sync template from controller", "Audit recent CLI logins"],
      if_unresolved: ["Reboot switch to load startup-config", "Lock local VTY lines"]
    },
    cli_commands: [
      "show archive log config all",
      "show netconf-yang sessions",
      "show vlan brief"
    ],
    shap_evidence: {
      "Config Hash Mismatch": "+50%",
      "VLAN Drops": "+30%",
      "API Auth Fails": "+10%"
    },
    historical_incident: {
      incident_id: "Incident #404",
      resolved_by: "Forced full provision from DNA Center.",
      similarity: "82%"
    },
    recovery_toast: "Configuration rollback pushed successfully via NETCONF."
  },
  {
    id: "ospf-instability",
    name: "OSPF Neighbor Instability",
    mission_status: "Deep Space Mission",
    initial_telemetry: { "OSPF State": "FULL", "SPF Runs": "2/hr", "Link State": "UP" },
    degraded_telemetry: { "OSPF State": "INIT/2WAY", "SPF Runs": "120/hr", "Link State": "Flapping" },
    recovered_telemetry: { "OSPF State": "FULL", "SPF Runs": "0/hr", "Link State": "UP" },
    prediction: {
      issue: "OSPF Adjacency Churn",
      eta: "8 minutes",
      confidence: "89%",
      severity: "HIGH"
    },
    evidence: {
      "Hello Packets": "Intermittent drops",
      "Adjacency": "Dropping to INIT every 40s",
      "SPF Algorithm": "Running constantly causing CPU spike"
    },
    root_cause: {
      primary_hypothesis: "Unidirectional link failure or layer 2 switch issue",
      alternative_causes: ["MTU Mismatch", "Duplicate Router ID"]
    },
    affected_scope: {
      router: "RTR-AGG-02",
      interface: "Vlan500",
      sites: ["Aggregation Layer"],
      services: ["Inter-VLAN Routing"],
      impact: "HIGH"
    },
    recommended_actions: {
      immediate: ["Check for unidirectional link (UDLD)", "Verify switchport spanning-tree state", "Check MTU on both ends"],
      if_unresolved: ["Hardcode OSPF network type to point-to-point", "Bounce interface"]
    },
    cli_commands: [
      "show ip ospf neighbor detail",
      "show udld neighbors",
      "show spanning-tree vlan 500"
    ],
    shap_evidence: {
      "Hello Packet Loss": "+45%",
      "SPF Run Frequency": "+35%",
      "Adjacency State": "+15%"
    },
    historical_incident: {
      incident_id: "Incident #118",
      resolved_by: "Detected unidirectional fiber, replaced cable.",
      similarity: "86%"
    },
    recovery_toast: "UDLD err-disabled the faulty link. Traffic converged to backup OSPF path."
  },
  {
    id: "fiber-cut",
    name: "Fiber Cut / Link Failure",
    mission_status: "Satellite Launch (PSLV-C60)",
    initial_telemetry: { "Optical Rx Power": "-5 dBm", "Interface State": "UP", "BGP": "ESTAB" },
    degraded_telemetry: { "Optical Rx Power": "-40 dBm", "Interface State": "DOWN", "BGP": "IDLE" },
    recovered_telemetry: { "Optical Rx Power": "-5 dBm", "Interface State": "UP", "BGP": "ESTAB" },
    prediction: {
      issue: "Physical Layer Transport Failure",
      eta: "Occurred",
      confidence: "99%",
      severity: "CRITICAL"
    },
    evidence: {
      "Optical Rx Power": "Dropped below threshold (-40 dBm)",
      "Carrier Detect": "Lost",
      "Interface Status": "Down / Down",
      "Routing Protocol": "Adjacency torn down"
    },
    root_cause: {
      primary_hypothesis: "Fiber cut between PE-1 and PE-2",
      alternative_causes: ["Complete DWDM node failure", "Transceiver burnout"]
    },
    affected_scope: {
      router: "PE-RTR-01",
      interface: "TenGigE0/0/1",
      sites: ["Core Backbone Segment A"],
      services: ["All Transit Traffic"],
      impact: "CRITICAL"
    },
    recommended_actions: {
      immediate: ["Verify backup path converged", "Engage dark fiber provider", "Check remote end optical Tx"],
      if_unresolved: ["Deploy field technician to splice point"]
    },
    cli_commands: [
      "show controllers TenGigE0/0/1 phy",
      "show interfaces TenGigE0/0/1 transceiver detail",
      "show ip route"
    ],
    shap_evidence: {
      "Rx Power Drop": "+80%",
      "Carrier Loss": "+15%",
      "Interface Down": "+4%"
    },
    historical_incident: {
      incident_id: "Incident #501",
      resolved_by: "ISP repaired fiber cut caused by construction.",
      similarity: "99%"
    },
    recovery_toast: "Fast Reroute (FRR) activated. Sub-50ms failover complete."
  }
];
