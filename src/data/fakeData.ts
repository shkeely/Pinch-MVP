export const FAKE_DATA = {
  homepage: {
    userName: "Rachel",
    needsAttention: [
      {
        id: "1",
        type: "escalated",
        title: "Guest Question Escalated",
        description: "Sarah asked about bringing her service dog - requires your personal approval",
        urgent: true,
        timestamp: "2 hours ago"
      },
      {
        id: "2",
        type: "suggestion",
        title: "Consider Adding Hotel Block Info",
        description: "3 guests have asked about nearby hotels in the past week",
        urgent: false,
        timestamp: "Today"
      },
      {
        id: "3",
        type: "suggestion",
        title: "Update Ceremony Time",
        description: "You mentioned the time might change - update your knowledge base to avoid confusion",
        urgent: false,
        timestamp: "Yesterday"
      }
    ],
    handledToday: [
      {
        guestName: "Sally",
        question: "Parking",
        timestamp: "10 mins ago"
      },
      {
        guestName: "Tom",
        question: "Dress Code",
        timestamp: "1 hour ago"
      },
      {
        guestName: "John",
        question: "Registry",
        timestamp: "2 hours ago"
      },
      {
        guestName: "Emma",
        question: "Plus-ones",
        timestamp: "3 hours ago"
      },
      {
        guestName: "Mike",
        question: "Ceremony Location",
        timestamp: "4 hours ago"
      }
    ],
    upcomingAnnouncements: [
      {
        id: "1",
        title: "RSVP Deadline Reminder",
        date: "Nov 15, 2025",
        time: "9:00 AM",
        guests: 120,
        status: "Scheduled"
      },
      {
        id: "2",
        title: "Day-Of Reminder",
        date: "Apr 15, 2025",
        time: "9:00 AM",
        guests: 127,
        status: "Scheduled"
      }
    ]
  }
};
