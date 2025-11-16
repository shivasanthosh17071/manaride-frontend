"use client";

export default function BookingFlow() {
  const steps = [
    {
      number: 1,
      title: "Reserve Vehicle",
      text: "User selects a vehicle and clicks the Reserve button. Basic details like name, phone number, and preferred dates are collected.",
    },
    {
      number: 2,
      title: "Owner Gets Notification",
      text: "An instant email alert is sent to the vehicle owner with all booking details, including customer request and vehicle information.",
    },
    {
      number: 3,
      title: "Owner Updates Status",
      text: "Owner logs into their Mana Ride dashboard to approve or reject the booking. Once approved, the system updates vehicle status.",
    },
    {
      number: 4,
      title: "Contact Info Shared",
      text: "After approval, owner receives the customer’s phone number and the customer receives the owner’s contact details.",
    },
    {
      number: 5,
      title: "Pickup & Ride",
      text: "Customer meets the owner, completes verification, picks up the vehicle, and enjoys a smooth rental experience.",
    },
  ];

  return (
    <section
      style={{
        maxWidth: "1200px",
        margin: "5rem auto",
        padding: "0 2rem",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
          fontWeight: "800",
          color: "var(--dark)",
          marginBottom: "3rem",
        }}
      >
        How Vehicle Booking Works
      </h2>

      <div
        className="d-flex flex-wrap justify-content-center gap-4"
        style={{ rowGap: "2rem" }}
      >
        {steps.map((step, idx) => (
          <div
            key={step.number}
            style={{
              background: "var(--white)",
              padding: "2rem",
              borderRadius: "var(--border-radius)",
              width: "300px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow =
                "0 12px 30px rgba(255, 111, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(0,0,0,0.1)";
            }}
          >
            <div
              style={{
                background:
                  "linear-gradient(135deg, var(--primary-orange), var(--accent-amber))",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                color: "var(--white)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "1.2rem",
                margin: "0 auto 1rem",
              }}
            >
              {step.number}
            </div>

            <h4 style={{ fontWeight: "700", marginBottom: "0.5rem" }}>
              {step.title}
            </h4>

            <p style={{ color: "#666", fontSize: "0.95rem" }}>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
