import { useState, useMemo, useEffect } from "react";

const fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const fmtUSD = (n) => "$" + Math.round(n).toLocaleString("en-IN");
const pct = (n) => n.toFixed(1) + "%";

const ACCENT = {
  oem: "#2563eb",
  importer: "#0d9488",
  sf: "#b45309",
  border: "#1e2a3a",
  card: "#111827",
  bg: "#0c1222",
  muted: "#64748b",
  text: "#e2e8f0",
};

function InputBox({ label, value, onChange, prefix = "₹", step = 100 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 11, color: ACCENT.muted, fontFamily: "IBM Plex Mono, monospace" }}>
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", background: ACCENT.card, border: `1px solid ${ACCENT.border}`, borderRadius: 6, overflow: "hidden" }}>
        <span style={{ padding: "6px 10px", color: ACCENT.muted, fontSize: 12, fontFamily: "IBM Plex Mono, monospace" }}>
          {prefix}
        </span>
        <input
          type="number"
          value={value}
          onChange={onChange}
          step={step}
          style={{
            background: "transparent", border: "none", outline: "none",
            color: ACCENT.text, fontSize: 13, fontFamily: "IBM Plex Mono, monospace",
            padding: "6px 10px", width: "100%"
          }}
        />
      </div>
    </div>
  );
}

function Row({ label, value, type = "cost", note = "", indent = false, personaColor }) {
  const colors = {
    cost: "#94a3b8",
    sf: ACCENT.muted,
    sub: ACCENT.text,
    total: personaColor || ACCENT.importer,
    header: ACCENT.muted,
    dim: "#64748b",
    alert: "#dc2626",
    persona: personaColor || ACCENT.oem,
  };
  const isPersona = type === "persona";
  const isTotal = type === "total";
  const highlight = isPersona || isTotal;
  const leftBorder = highlight ? (personaColor || ACCENT.importer) : "transparent";
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "8px 12px",
      background: "transparent",
      borderLeft: leftBorder !== "transparent" ? `3px solid ${leftBorder}` : "3px solid transparent",
      borderRadius: 4,
      marginLeft: indent ? 16 : 0,
    }}>
      <span style={{ fontSize: 12, color: colors[type] || "#94a3b8", fontFamily: "IBM Plex Mono, monospace", display: "flex", alignItems: "center", gap: 6 }}>
        {label}
        {note && <span style={{ fontSize: 10, color: ACCENT.muted, marginLeft: 6 }}>{note}</span>}
      </span>
      <span style={{ fontSize: 13, fontFamily: "IBM Plex Mono, monospace", color: colors[type] || "#94a3b8", fontWeight: highlight ? 600 : 400 }}>
        {value}
      </span>
    </div>
  );
}

function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0" }}>
      <div style={{ flex: 1, height: 1, background: ACCENT.border }} />
      {label && <span style={{ fontSize: 10, color: ACCENT.muted, fontFamily: "IBM Plex Mono, monospace" }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: ACCENT.border }} />
    </div>
  );
}

function RevenueMarginCard({ title, items, accentColor }) {
  return (
    <div style={{
      marginTop: 24,
      padding: "18px 20px",
      background: ACCENT.card,
      border: `1px solid ${ACCENT.border}`,
      borderRadius: 8,
      borderLeft: `4px solid ${accentColor}`,
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: accentColor, fontFamily: "IBM Plex Mono, monospace", marginBottom: 12 }}>
        {title}
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < items.length - 1 ? `1px solid ${ACCENT.border}` : "none" }}>
          <span style={{ fontSize: 12, color: ACCENT.muted, fontFamily: "IBM Plex Mono, monospace" }}>{item.label}</span>
          <span style={{ fontSize: 13, fontFamily: "IBM Plex Mono, monospace", color: item.highlight ? accentColor : ACCENT.text, fontWeight: item.highlight ? 700 : 500 }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function Hero({ title, value, subtitle, accentColor }) {
  return (
    <div style={{
      marginBottom: 24,
      padding: "20px 24px",
      background: ACCENT.card,
      border: `1px solid ${ACCENT.border}`,
      borderRadius: 8,
      borderLeft: `4px solid ${accentColor}`,
    }}>
      <div style={{ fontSize: 12, color: ACCENT.muted, fontFamily: "IBM Plex Mono, monospace", marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: accentColor, fontFamily: "IBM Plex Mono, monospace", letterSpacing: -0.5 }}>{value}</div>
      {subtitle && <div style={{ fontSize: 11, color: ACCENT.muted, fontFamily: "IBM Plex Mono, monospace", marginTop: 6, lineHeight: 1.4 }}>{subtitle}</div>}
    </div>
  );
}

function FlowSection({ title, explainer, children, accentColor }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: accentColor, fontFamily: "IBM Plex Mono, monospace", marginBottom: 4 }}>{title}</div>
      {explainer && <div style={{ fontSize: 11, color: ACCENT.muted, marginBottom: 10, lineHeight: 1.4 }}>{explainer}</div>}
      <div style={{ background: ACCENT.card, borderRadius: 8, padding: "12px 16px", border: `1px solid ${ACCENT.border}` }}>
        {children}
      </div>
    </div>
  );
}

function ProductionPhaseRows({ fob, logistics, cha, landedPortUSD, landedPortINR, usdInr, transportFactory, indianComponents, consumables, assembly, factoryLanding, personaColor }) {
  return (
    <>
      <Row label="Vehicle FOB" value={fmtUSD(fob)} type="dim" />
      <Row label="Logistics" value={fmtUSD(logistics)} type="dim" />
      <Row label="CHA + currency R" value={fmtUSD(cha)} type="dim" />
      <Row label="Landed PORT" value={fmtUSD(landedPortUSD)} type="sub" />
      <Row label="Landed PORT" value={fmt(landedPortINR)} type="sub" note={`INR @ ₹${usdInr}/USD`} />
      <Row label="Transport" value={fmt(transportFactory)} type="dim" indent />
      <Row label="Indian Components" value={fmt(indianComponents)} type="dim" indent />
      <Row label="Consumables" value={fmt(consumables)} type="dim" indent />
      <Row label="Assembly cost" value={fmt(assembly)} type="dim" indent />
      <Row label="Factory Landing" value={fmt(factoryLanding)} type="total" personaColor={personaColor} />
    </>
  );
}

export default function EVDealModeller() {
  const [tab, setTab] = useState(0);
  const [persona, setPersona] = useState("oem");
  const [showInputs, setShowInputs] = useState(false);
  const [p, setP] = useState({
    usdInr: 92,
    fob: 130,
    logistics: 40,
    cha: 70,
    transportFactory: 1200,
    indianComponents: 3200,
    consumables: 1450,
    assembly: 2800,
    mmRate: 6,
    advanceFromImporter: 50000,
    transportDealer: 2500,
    dealerMargin: 7000,
    mfgMargin: 1000,
    actualInsuranceRTO: 5500,
    sundock: 2000,
    deposit: 2500,
    monthlyRentCustomer: 2750,
    monthlyRentLeasingCo: 2500,
    tenure: 24,
    importerMargin10pct: 10,
  });

  const set = (key) => (e) => setP((prev) => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }));

  const c = useMemo(() => {
    const landedPortUSD = p.fob + p.logistics + p.cha;
    const landedPortINR = landedPortUSD * p.usdInr;
    const factoryLanding = landedPortINR + p.transportFactory + p.indianComponents + p.consumables + p.assembly;

    // ── CURRENT MATH ──────────────────────────────────────
    const mmInterest = landedPortINR * (p.mmRate / 100);
    const cpToFactory = factoryLanding + mmInterest;
    const gst1 = cpToFactory * 0.05;
    const salePrice1 = cpToFactory + gst1 + p.transportDealer + p.dealerMargin;

    // ── LEASING MODEL ──────────────────────────────────────
    // Production
    const sfFee_2pct = factoryLanding * 0.02;
    const sfFee_10pct = p.advanceFromImporter * 0.10;
    const totalProductionSF = sfFee_2pct + sfFee_10pct;
    const salePriceToLeasingCo = factoryLanding + p.mfgMargin;

    // Distribution
    const gst2 = salePriceToLeasingCo * 0.05;
    const sfDistributionFee = 1000;
    const totalInsuranceRTO = p.actualInsuranceRTO + sfDistributionFee; // = 6500
    const onRoad = salePriceToLeasingCo + p.transportDealer + gst2 + totalInsuranceRTO;
    const totalAssetCost = onRoad + p.sundock;

    // Revenue
    const sfPerMonth = p.monthlyRentCustomer - p.monthlyRentLeasingCo;
    const sfRentalRevenue = sfPerMonth * p.tenure;
    const totalCustomerRevenue = p.monthlyRentCustomer * p.tenure;
    const leasingCoRevenue = p.monthlyRentLeasingCo * p.tenure;
    const leasingCoMargin = leasingCoRevenue - totalAssetCost;
    const leasingCoROI = (leasingCoMargin / 2) / totalAssetCost;
    const totalSFRevenue = totalProductionSF + sfDistributionFee + sfRentalRevenue;

    // ── OEM MODEL ─────────────────────────────────────────
    const importerMarginAmt = landedPortINR * (p.importerMargin10pct / 100);
    const salePriceToOEM = factoryLanding + importerMarginAmt;

    return {
      landedPortUSD, landedPortINR, factoryLanding,
      mmInterest, cpToFactory, gst1, salePrice1,
      sfFee_2pct, sfFee_10pct, totalProductionSF,
      salePriceToLeasingCo, gst2, sfDistributionFee, totalInsuranceRTO,
      onRoad, totalAssetCost,
      sfPerMonth, sfRentalRevenue, totalCustomerRevenue,
      leasingCoRevenue, leasingCoMargin, leasingCoROI, totalSFRevenue,
      importerMarginAmt, salePriceToOEM,
    };
  }, [p]);

  const allTabs = [
    { label: "Current Math", sublabel: "Money Multiplier", index: 0 },
    { label: "Leasing Model", sublabel: "3-Phase Revenue", index: 1 },
    { label: "OEM Sale", sublabel: "Direct B2B", index: 2 },
  ];
  const tabs = persona === "importer" ? allTabs.filter((t) => t.index !== 0) : allTabs;

  useEffect(() => {
    if (persona === "importer" && tab === 0) setTab(1);
  }, [persona]);

  const personaColor = persona === "oem" ? ACCENT.oem : ACCENT.importer;

  return (
    <div style={{
      minHeight: "100vh",
      background: ACCENT.bg,
      fontFamily: "'Syne', sans-serif",
      color: ACCENT.text,
      padding: "0 0 40px 0",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Syne:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: ACCENT.card, borderBottom: `1px solid ${ACCENT.border}`, padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: ACCENT.text }}>EV Deal Modeller</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: ACCENT.muted, fontFamily: "IBM Plex Mono, monospace" }}>View as</span>
            <div style={{ display: "flex", background: ACCENT.bg, borderRadius: 6, border: `1px solid ${ACCENT.border}`, overflow: "hidden" }}>
              <button
                onClick={() => setPersona("oem")}
                style={{
                  padding: "6px 14px",
                  fontSize: 12,
                  fontFamily: "IBM Plex Mono, monospace",
                  fontWeight: persona === "oem" ? 600 : 400,
                  color: persona === "oem" ? "#fff" : ACCENT.muted,
                  background: persona === "oem" ? ACCENT.oem : "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                OEM
              </button>
              <button
                onClick={() => setPersona("importer")}
                style={{
                  padding: "6px 14px",
                  fontSize: 12,
                  fontFamily: "IBM Plex Mono, monospace",
                  fontWeight: persona === "importer" ? 600 : 400,
                  color: persona === "importer" ? "#fff" : ACCENT.muted,
                  background: persona === "importer" ? ACCENT.importer : "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Importer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Base inputs — collapsible */}
      <div style={{ background: ACCENT.card, borderBottom: `1px solid ${ACCENT.border}`, padding: "0 28px" }}>
        <button
          onClick={() => setShowInputs(!showInputs)}
          style={{
            width: "100%",
            padding: "12px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "none",
            border: "none",
            color: ACCENT.muted,
            fontSize: 11,
            fontFamily: "IBM Plex Mono, monospace",
            cursor: "pointer",
          }}
        >
          <span>Assumptions: Landed port {fmt(c.landedPortINR)} → Factory landing {fmt(c.factoryLanding)}</span>
          <span style={{ fontSize: 14 }}>{showInputs ? "−" : "+"}</span>
        </button>
        {showInputs && (
          <div style={{ paddingBottom: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
              <InputBox label="USD / INR" value={p.usdInr} onChange={set("usdInr")} prefix="₹" step={0.5} />
              <InputBox label="Vehicle FOB" value={p.fob} onChange={set("fob")} prefix="$" step={5} />
              <InputBox label="Logistics" value={p.logistics} onChange={set("logistics")} prefix="$" step={5} />
              <InputBox label="CHA + CR" value={p.cha} onChange={set("cha")} prefix="$" step={5} />
              <InputBox label="Transport to Factory" value={p.transportFactory} onChange={set("transportFactory")} prefix="₹" step={100} />
              <InputBox label="Indian Components" value={p.indianComponents} onChange={set("indianComponents")} prefix="₹" step={100} />
              <InputBox label="Consumables" value={p.consumables} onChange={set("consumables")} prefix="₹" step={100} />
              <InputBox label="Assembly Cost" value={p.assembly} onChange={set("assembly")} prefix="₹" step={100} />
            </div>
          </div>
        )}
      </div>

      {/* Tabs — Importer sees only Leasing + OEM Sale (no Money Multiplier) */}
      <div style={{ display: "flex", padding: "0 28px", borderBottom: `1px solid ${ACCENT.border}`, background: ACCENT.bg }}>
        {tabs.map((t) => (
          <button key={t.index} onClick={() => setTab(t.index)} style={{
            padding: "12px 20px",
            background: "transparent",
            border: "none",
            borderBottom: tab === t.index ? `2px solid ${personaColor}` : "2px solid transparent",
            cursor: "pointer",
            color: tab === t.index ? personaColor : ACCENT.muted,
            fontFamily: "Syne, sans-serif",
            fontWeight: tab === t.index ? 600 : 400,
          }}>
            <div style={{ fontSize: 13 }}>{t.label}</div>
            <div style={{ fontSize: 10, fontFamily: "IBM Plex Mono, monospace", marginTop: 2, opacity: 0.8 }}>{t.sublabel}</div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: "20px 28px", maxWidth: 900, margin: "0 auto" }}>

        {/* ──────── TAB 0: CURRENT MATH ──────── */}
        {tab === 0 && (
          <div style={{ maxWidth: 560 }}>
            <FlowSection title="Production phase" explainer="Cost line-by-line to factory landing, then interest." accentColor={personaColor}>
              <ProductionPhaseRows
                fob={p.fob}
                logistics={p.logistics}
                cha={p.cha}
                landedPortUSD={c.landedPortUSD}
                landedPortINR={c.landedPortINR}
                usdInr={p.usdInr}
                transportFactory={p.transportFactory}
                indianComponents={p.indianComponents}
                consumables={p.consumables}
                assembly={p.assembly}
                factoryLanding={c.factoryLanding}
                personaColor={personaColor}
              />
              <Divider />
              <Row label="Interest" value={fmt(c.mmInterest)} type="dim" note={`${p.mmRate}% 45D`} />
              <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 10, color: ACCENT.muted }}>MM rate %</span>
                <input type="number" value={p.mmRate} onChange={set("mmRate")} step={0.5} style={{ width: 48, background: ACCENT.bg, border: `1px solid ${ACCENT.border}`, borderRadius: 4, color: ACCENT.text, fontSize: 12, padding: "4px 6px", outline: "none", textAlign: "center" }} />
              </div>
            </FlowSection>

            <FlowSection title="Distribution phase" explainer="CP to factory, GST, transport, dealer margin → sale price." accentColor={personaColor}>
              <Row label="CP to Factory" value={fmt(c.cpToFactory)} type="sub" />
              <Row label="GST" value={fmt(c.gst1)} type="dim" indent />
              <Row label="Transport" value={fmt(p.transportDealer)} type="dim" indent />
              <Row label="Dealer margin" value={fmt(p.dealerMargin)} type="dim" indent />
              <Row label="Sale price" value={fmt(c.salePrice1)} type="total" personaColor={personaColor} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                <InputBox label="Transport" value={p.transportDealer} onChange={set("transportDealer")} prefix="₹" step={100} />
                <InputBox label="Dealer margin" value={p.dealerMargin} onChange={set("dealerMargin")} prefix="₹" step={500} />
              </div>
            </FlowSection>

            <RevenueMarginCard
              title="Revenue and margin — Current Math (OEM)"
              accentColor={personaColor}
              items={[
                { label: "Your cost price", value: fmt(c.cpToFactory) },
                { label: "Your revenue (sale price)", value: fmt(c.salePrice1), highlight: true },
                { label: "Your margin", value: fmt(c.salePrice1 - c.cpToFactory), highlight: true },
              ]}
            />
          </div>
        )}

        {/* ──────── TAB 1: LEASING MODEL (Sale to Leasing Company) ──────── */}
        {tab === 1 && (
          <div style={{ maxWidth: 560 }}>
            <FlowSection title="Production phase" explainer="Cost line-by-line to factory landing, then margin to MFG → sale price to leasing co." accentColor={personaColor}>
              <ProductionPhaseRows
                fob={p.fob}
                logistics={p.logistics}
                cha={p.cha}
                landedPortUSD={c.landedPortUSD}
                landedPortINR={c.landedPortINR}
                usdInr={p.usdInr}
                transportFactory={p.transportFactory}
                indianComponents={p.indianComponents}
                consumables={p.consumables}
                assembly={p.assembly}
                factoryLanding={c.factoryLanding}
                personaColor={personaColor}
              />
              <Divider />
              <Row label="Margin to Mfg" value={fmt(p.mfgMargin)} type="dim" />
              <Row label="Sale price" value={fmt(c.salePriceToLeasingCo)} type="total" personaColor={personaColor} note="to leasing co" />
              <div style={{ marginTop: 8 }}>
                <InputBox label="Margin to Mfg" value={p.mfgMargin} onChange={set("mfgMargin")} prefix="₹" step={100} />
              </div>
            </FlowSection>

            <FlowSection title="Distribution phase" explainer="Transport, GST, Insurance & RTO, on-road, sun dock." accentColor={personaColor}>
              <Row label="Transport" value={fmt(p.transportDealer)} type="dim" />
              <Row label="GST" value={fmt(c.gst2)} type="dim" />
              <Row label="Insurance & RTO" value={fmt(c.totalInsuranceRTO)} type="dim" />
              <Row label="On Road Price" value={fmt(c.onRoad)} type="sub" />
              <Row label="Sun Dock" value={fmt(p.sundock)} type="dim" />
              <Row label="Total asset cost" value={fmt(c.totalAssetCost)} type="total" personaColor={personaColor} note="leasing co" />
              <div style={{ marginTop: 8 }}>
                <InputBox label="Insurance & RTO" value={p.actualInsuranceRTO} onChange={set("actualInsuranceRTO")} prefix="₹" step={100} />
              </div>
            </FlowSection>

            <FlowSection title="Revenue phase (revenue economics)" explainer="Deposit, monthly rent, tenure → total revenue, margin, ROI%." accentColor={personaColor}>
              <Row label="Deposit" value={fmt(p.deposit)} type="dim" />
              <Row label="Monthly Rent" value={fmt(p.monthlyRentLeasingCo)} type="dim" />
              <Row label="Tenure" value={`${p.tenure}`} type="dim" note="months" />
              <Row label="Total Revenue" value={fmt(c.leasingCoRevenue)} type="total" personaColor={personaColor} note="lease revenue" />
              <Row label="Margin" value={fmt(c.leasingCoMargin)} type={c.leasingCoMargin >= 0 ? "total" : "alert"} personaColor={personaColor} />
              <Row label="ROI%" value={pct(c.leasingCoROI * 100)} type={c.leasingCoROI >= 0 ? "sub" : "alert"} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                <InputBox label="Monthly Rent" value={p.monthlyRentLeasingCo} onChange={set("monthlyRentLeasingCo")} prefix="₹" step={50} />
                <InputBox label="Tenure (months)" value={p.tenure} onChange={set("tenure")} prefix="mo" step={1} />
                <InputBox label="Deposit" value={p.deposit} onChange={set("deposit")} prefix="₹" step={100} />
              </div>
            </FlowSection>

            <RevenueMarginCard
              title={`Revenue and margin — Sale to Leasing Co (${persona === "oem" ? "OEM" : "Importer"})`}
              accentColor={personaColor}
              items={persona === "oem"
                ? [
                    { label: "Your revenue (selling price to leasing co)", value: fmt(c.salePriceToLeasingCo), highlight: true },
                    { label: "Your cost (factory landing)", value: fmt(c.factoryLanding) },
                    { label: "Your margin", value: fmt(p.mfgMargin), highlight: true },
                  ]
                : [
                    { label: "Your revenue (lease revenue)", value: fmt(c.leasingCoRevenue), highlight: true },
                    { label: "Your cost (total asset cost)", value: fmt(c.totalAssetCost) },
                    { label: "Your margin", value: fmt(c.leasingCoMargin), highlight: true },
                  ]}
            />
          </div>
        )}

        {/* ──────── TAB 2: OEM MODEL (Sale to OEM Company) ──────── */}
        {tab === 2 && (
          <div style={{ maxWidth: 560 }}>
            <FlowSection title="Production phase" explainer="Cost line-by-line to factory landing, then margin to importer → sale price to OEM." accentColor={personaColor}>
              <ProductionPhaseRows
                fob={p.fob}
                logistics={p.logistics}
                cha={p.cha}
                landedPortUSD={c.landedPortUSD}
                landedPortINR={c.landedPortINR}
                usdInr={p.usdInr}
                transportFactory={p.transportFactory}
                indianComponents={p.indianComponents}
                consumables={p.consumables}
                assembly={p.assembly}
                factoryLanding={c.factoryLanding}
                personaColor={personaColor}
              />
              <Divider />
              <Row label="Margin to importer" value={fmt(c.importerMarginAmt)} type="dim" note={`${p.importerMargin10pct}% on landed port`} />
              <Row label="Sale price" value={fmt(c.salePriceToOEM)} type="total" personaColor={personaColor} note="to OEM" />
              <div style={{ marginTop: 8 }}>
                <InputBox label="Margin to importer %" value={p.importerMargin10pct} onChange={set("importerMargin10pct")} prefix="%" step={1} />
              </div>
            </FlowSection>

            <FlowSection title="Distribution phase" explainer="Distribution and revenue handled by manufacturer." accentColor={personaColor}>
              <div style={{ padding: "12px 0", fontSize: 12, color: ACCENT.muted, fontFamily: "IBM Plex Mono, monospace" }}>
                Distribution and revenue handled by manufacturer.
              </div>
            </FlowSection>

            <RevenueMarginCard
              title={`Revenue and margin — Sale to OEM Co (${persona === "oem" ? "OEM" : "Importer"})`}
              accentColor={personaColor}
              items={persona === "oem"
                ? [
                    { label: "Your cost (purchase price)", value: fmt(c.salePriceToOEM), highlight: true },
                    { label: "Margin", value: "—", highlight: false },
                  ]
                : [
                    { label: "Your revenue (sale to OEM)", value: fmt(c.salePriceToOEM), highlight: true },
                    { label: "Your cost (factory landing)", value: fmt(c.factoryLanding) },
                    { label: "Your margin", value: fmt(c.importerMarginAmt), highlight: true },
                  ]}
            />
          </div>
        )}

      </div>
    </div>
  );
}
