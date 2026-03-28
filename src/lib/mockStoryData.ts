export const mockStory = {
  title: "A Hidden Network: Mapping Digital Surveillance across Region A",
  publishedDate: "2024-03-29T10:00:00Z",
  author: "The Activaterights.org Investigation Team",
  content: [
    {
      _type: "text",
      value: "Our six-month investigation into digital surveillance across Region A revealed a systematic network of interception points. These are not randomized events; they map directly to known locations of independent media hubs and human rights legal clinics."
    },
    // MAP BLOCK START (MOCKED DATA POINTS)
    {
      _type: "mapBlock",
      title: "Confirmed Surveillance Hotspots (Region A)",
      center: [51.505, -0.09], // London-centric coordinates for demo
      zoom: 13,
      // In production, this JSON array will be built by journalists in Sanity
      points: [
        { id: 1, lat: 51.505, lng: -0.09, label: "Independent Media Lab (Interception Detected)" },
        { id: 2, lat: 51.51, lng: -0.1, label: "Legal Clinic 'Justice Now' (DPI Node)" },
        { id: 3, lat: 51.515, lng: -0.08, label: "Citizen Journalism Hub" },
        { id: 4, lat: 51.499, lng: -0.11, label: "VPN Provider Office" }
      ]
    },
    // MAP BLOCK END
    {
      _type: "text",
      value: "By clicking on the icons, you can see the specific type of human rights intersection identified at each point. But the real insight is how this network scales."
    },
    // SCROLLYTELLING BLOCK START
    {
      _type: "scrollyBlock",
      mainText: "Each point represents a breach of privacy and a chilling effect on free expression.",
      animationTriggers: [
        { id: 1, trigger: 0.1, text: "The network begins with subtle monitoring." },
        { id: 2, trigger: 0.4, text: "By 2023, data logging became 24/7." },
        { id: 3, trigger: 0.7, text: "We have confirmed active interception in real-time." },
        { id: 4, trigger: 0.9, text: "Free speech is effectively paralyzed here." }
      ]
    },
    // SCROLLYTELLING BLOCK END
    {
      _type: "text",
      value: "This mapping confirms the need for immediate digital security training and international technological oversight in Region A."
    }
  ]
};