// client/src/pricing/PricingPage.test.jsx
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, afterEach } from "vitest";
import PricingPage from "./PricingPage";
import PricingRow from "./PricingRow";
import { Monitor } from "lucide-react";

afterEach(() => {
  cleanup();
});

// Render any motion.<tag> as the plain element, dropping animation-only props.
vi.mock("framer-motion", () => {
  const MOTION_PROPS = ["initial", "animate", "exit", "transition", "variants", "custom", "viewport", "whileHover", "whileInView", "whileTap"];
  const plain = (Tag) => function MotionStub(props) {
    const rest = { ...props };
    MOTION_PROPS.forEach((key) => delete rest[key]);
    return <Tag {...rest} />;
  };
  return { motion: new Proxy({}, { get: (_, tag) => plain(tag) }) };
});

globalThis.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Wrap with MemoryRouter because PricingNav uses <Link>
function renderPricingPage() {
  return render(
    <MemoryRouter>
      <PricingPage />
    </MemoryRouter>
  );
}

describe("PricingPage", () => {
  it("renders all three service rows", () => {
    renderPricingPage();
    expect(screen.getByText("Landing Page")).toBeDefined();
    expect(screen.getByText("Full Stack Application")).toBeDefined();
    expect(screen.getByText("Custom / Ongoing")).toBeDefined();
  });

  it("renders the back-to-portfolio link", () => {
    renderPricingPage();
    expect(screen.getByText("Back to portfolio")).toBeDefined();
  });

  it("renders the CTA button linking to email", () => {
    renderPricingPage();
    const link = screen.getByText("Get in Touch →").closest("a");
    expect(link.href).toContain("mailto:");
  });
});

describe("PricingRow", () => {
  function renderRow(overrides = {}) {
    return render(
      <PricingRow
        icon={Monitor}
        title="Test Service"
        price="$500"
        description="A test description."
        pills={["React", "Vite"]}
        {...overrides}
      />
    );
  }

  it("renders title, price, and description", () => {
    renderRow();
    expect(screen.getByText("Test Service")).toBeDefined();
    expect(screen.getByText("$500")).toBeDefined();
    expect(screen.getByText("A test description.")).toBeDefined();
  });

  it("renders tech pills", () => {
    renderRow();
    expect(screen.getByText("React")).toBeDefined();
    expect(screen.getByText("Vite")).toBeDefined();
  });

  it("shows 'Most Popular' badge when highlighted", () => {
    renderRow({ highlighted: true });
    expect(screen.getByText("Most Popular")).toBeDefined();
  });

  it("does not show 'Most Popular' badge when not highlighted", () => {
    renderRow({ highlighted: false });
    expect(screen.queryByText("Most Popular")).toBeNull();
  });

  it("renders no pills when pills array is empty", () => {
    renderRow({ pills: [] });
    expect(screen.queryByText("React")).toBeNull();
  });
});
