// @ts-nocheck
// "use client";
import { useMemo, useState } from "react";

function Card({
  children,
  className = "",
}: {
  children: any;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl border border-zinc-800 bg-zinc-900/60 ${className}`}>
      {children}
    </div>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
  hint,
}: {
  label: any;
  placeholder: any;
  value: any;
  onChange: any;
  hint?: any;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-medium text-zinc-300">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
      />
      {hint ? <div className="mt-2 text-xs leading-5 text-zinc-500">{hint}</div> : null}
    </label>
  );
}

function ResultStat({ label, value, accent = false }) {
  return (
    <div className={`rounded-2xl border px-4 py-4 ${accent ? "border-emerald-400/25 bg-emerald-400/10" : "border-zinc-800 bg-zinc-950/70"}`}>
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div className={`mt-2 text-2xl font-bold ${accent ? "text-emerald-300" : "text-white"}`}>{value}</div>
    </div>
  );
}

function ToolShell({ title, subtitle, children, resultPanel }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
      <div className="mb-8 max-w-3xl">
        <div className="mb-3 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
          Exchange-driven fair odds model
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{title}</h1>
        <p className="mt-4 text-base leading-7 text-zinc-400">{subtitle}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6 sm:p-7">{children}</Card>
        <Card className="p-6 sm:p-7">{resultPanel}</Card>
      </div>
    </div>
  );
}

function HomePage({ setPage }) {
  const tools = [
    {
      key: "team-to-score-first",
      title: "Team To Score First",
      description:
        "Estimate fair odds for first-goal team markets using a few exchange prices and a market-implied model.",
    },
    {
      key: "1h-btts",
      title: "1st Half BTTS",
      description:
        "Price first-half both teams to score markets from exchange goal lines and half-time prices.",
    },
    {
      key: "team-to-score-both-halves",
      title: "Team To Score In Both Halves",
      description:
        "Estimate fair odds for the home or away team to score in both halves using a light exchange-driven model.",
    },
    {
      key: "team-to-score-1h",
      title: "Team To Score In The First Half",
      description:
        "Price the chance of the home or away team scoring in the first half using HT Over 0.5 and HT 1X2.",
    },
    {
      key: "x-or-y-or-z",
      title: "X or Y or Z Calculator",
      description:
        "Combine fair odds for selections where only one outcome can win, with optional bookmaker odds and EV.",
    },
    {
      key: "specials",
      title: "Specials & Boosted Markets",
      description:
        "Check niche football boosts that do not have enough direct exchange liquidity to reveal a clean fair price.",
    },
  ];

  const steps = [
    "Find a boosted bookmaker market you want to price.",
    "Enter a small number of current exchange prices into the relevant calculator.",
    "Get a fair odds estimate and compare it with the bookmaker boost.",
  ];

  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
            Price boosted bookmaker markets from exchange inputs
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Fair odds for boosted markets that the exchange does not price cleanly
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            BoostChecker helps matched bettors and value bettors compile fair odds for regularly price-boosted football
            markets at major bookmakers by entering just a few current exchange prices.
          </p>

          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
            Many boosted specials do not have enough direct liquidity on the exchange to reveal a fair price on their
            own. In practice, the boosted bookmaker price often distorts the exchange too, because matched bettors are
            laying off the boost for guaranteed profit. That can make the visible exchange price a poor guide to true
            value.
          </p>

          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
            In many of these markets it is still possible to back meaningful stakes at inflated odds on the exchange,
            even if those odds are lower than the bookmaker’s boosted price. BoostChecker is built to help you estimate
            what the fair number should be before you decide whether the boost is worth taking.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => setPage("team-to-score-first")}
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02]"
            >
              Check Team To Score First
            </button>
            <button
              onClick={() => setPage("1h-btts")}
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900"
            >
              Check 1st Half BTTS
            </button>
          </div>
        </div>

        <div className="lg:pl-8">
          <Card className="p-6 shadow-2xl shadow-black/20">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-zinc-400">Example workflow</div>
                <div className="mt-1 text-2xl font-bold text-white">Boost check</div>
              </div>
              <div className="rounded-2xl bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">
                Manual input
              </div>
            </div>

            <div className="space-y-4">
              {[
                ["Bookmaker boost", "Man City to score both halves @ 2.00"],
                ["Exchange markets", "1X2, totals, 1st-half goals, related specials"],
                ["What BoostChecker does", "Compiles a fair price from the exchange inputs"],
                ["Your decision", "Compare fair odds to the boost and judge the edge"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
                  <div className="mt-1 text-sm leading-6 text-zinc-200">{value}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-zinc-800 bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white">How it works</h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">
              BoostChecker is designed for bettors who are comfortable sourcing their own exchange prices but want a
              faster and more structured way to estimate fair odds in markets that are hard to price directly.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={step} className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/10 text-sm font-bold text-emerald-300 ring-1 ring-emerald-400/20">
                  {index + 1}
                </div>
                <p className="text-sm leading-7 text-zinc-300">{step}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="why-it-exists" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-white">Why these markets are hard to price</h3>
            <p className="mt-4 text-base leading-7 text-zinc-400">
              Many specials and price boosts have limited or fragmented exchange liquidity. Sometimes a related market
              exists, but not with enough depth to treat the visible lay price as a clean fair number. And when a
              bookmaker boost attracts a lot of matched betting money, that activity can inflate the exchange itself.
            </p>
          </Card>

          <Card className="p-8">
            <h3 className="text-2xl font-bold text-white">What BoostChecker is built to do</h3>
            <p className="mt-4 text-base leading-7 text-zinc-400">
              Instead of relying on one distorted exchange line, BoostChecker uses a small set of relevant exchange
              prices to compile a more informed fair odds estimate. The goal is simple: help you decide whether a
              boosted bookmaker price still offers value after accounting for the shape of the wider market.
            </p>
          </Card>
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white">Current tools</h2>
          <p className="mt-4 text-base leading-7 text-zinc-400">
            Start with the most common boosted football markets. More calculators can be added over time as the toolkit
            grows.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <Card key={tool.title} className="group p-6 transition hover:border-zinc-700 hover:bg-zinc-900">
              <div className="flex h-full flex-col">
                <div>
                  <h3 className="text-xl font-semibold text-white">{tool.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-400">{tool.description}</p>
                </div>
                <div className="mt-6 pt-2">
                  <button
                    onClick={() => setPage(tool.key)}
                    className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 transition group-hover:border-emerald-400/40 group-hover:text-white"
                  >
                    Open calculator
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}

function factorial(n) {
  if (n <= 1) return 1;
  let f = 1;
  for (let i = 2; i <= n; i += 1) f *= i;
  return f;
}

function poisson(k, lambda) {
  return Math.exp(-lambda) * Math.pow(lambda, k) / factorial(k);
}

function matchProbs(muH, muA) {
  let pHome = 0;
  let pDraw = 0;
  let pAway = 0;

  for (let i = 0; i <= 10; i += 1) {
    for (let j = 0; j <= 10; j += 1) {
      const p = poisson(i, muH) * poisson(j, muA);
      if (i > j) pHome += p;
      else if (i === j) pDraw += p;
      else pAway += p;
    }
  }

  return { pHome, pDraw, pAway };
}

function solveMu(homeOdds, drawOdds, awayOdds, odds00) {
  const h = 1 / homeOdds;
  const d = 1 / drawOdds;
  const a = 1 / awayOdds;
  const sum = h + d + a;

  const pHome = h / sum;
  const pDraw = d / sum;
  const pAway = a / sum;

  const total = -Math.log(1 / odds00);
  let best = { error: Infinity, muHome: total / 2, muAway: total / 2 };

  for (let muH = 0.01; muH <= total - 0.01; muH += 0.01) {
    const muA = total - muH;
    const model = matchProbs(muH, muA);
    const error =
      Math.pow(model.pHome - pHome, 2) +
      Math.pow(model.pDraw - pDraw, 2) +
      Math.pow(model.pAway - pAway, 2);

    if (error < best.error) {
      best = { error, muHome: muH, muAway: muA };
    }
  }

  return best;
}

function poissonCdf(k, lambda) {
  let sum = 0;
  for (let i = 0; i <= k; i += 1) {
    sum += poisson(i, lambda);
  }
  return sum;
}

function fitTotalFromOvers(over05, over15, over25) {
  const target05 = Math.min(0.999, Math.max(0.001, 1 / over05));
  const target15 = Math.min(0.999, Math.max(0.001, 1 / over15));
  const target25 = Math.min(0.999, Math.max(0.001, 1 / over25));

  let best = { error: Infinity, lambda: 1.2 };

  for (let lambda = 0.05; lambda <= 4.5; lambda += 0.005) {
    const model05 = 1 - poisson(0, lambda);
    const model15 = 1 - poissonCdf(1, lambda);
    const model25 = 1 - poissonCdf(2, lambda);

    const error =
      Math.pow(model05 - target05, 2) +
      Math.pow(model15 - target15, 2) +
      Math.pow(model25 - target25, 2);

    if (error < best.error) {
      best = { error, lambda };
    }
  }

  return best;
}

function fitTotalFromSingleOver(overOdds, line) {
  const target = Math.min(0.999, Math.max(0.001, 1 / overOdds));
  let best = { error: Infinity, lambda: 1.2 };

  for (let lambda = 0.05; lambda <= 6.5; lambda += 0.005) {
    const threshold = Math.floor(line);
    const model = 1 - poissonCdf(threshold, lambda);
    const error = Math.pow(model - target, 2);

    if (error < best.error) {
      best = { error, lambda };
    }
  }

  return best;
}

function fitSplitFromHT1X2(totalXg, homeOdds, drawOdds, awayOdds) {
  const h = 1 / homeOdds;
  const d = 1 / drawOdds;
  const a = 1 / awayOdds;
  const sum = h + d + a;

  const pHome = h / sum;
  const pDraw = d / sum;
  const pAway = a / sum;

  let best = { error: Infinity, muHome: totalXg / 2, muAway: totalXg / 2 };

  for (let muH = 0.01; muH <= totalXg - 0.01; muH += 0.01) {
    const muA = totalXg - muH;
    const model = matchProbs(muH, muA);
    const error =
      Math.pow(model.pHome - pHome, 2) +
      Math.pow(model.pDraw - pDraw, 2) +
      Math.pow(model.pAway - pAway, 2);

    if (error < best.error) {
      best = { error, muHome: muH, muAway: muA };
    }
  }

  return best;
}

function TeamToScoreFirstPage({
  homeOdds,
  setHomeOdds,
  drawOdds,
  setDrawOdds,
  awayOdds,
  setAwayOdds,
  nilNilOdds,
  setNilNilOdds,
  bookieHomeOdds,
  setBookieHomeOdds,
  bookieAwayOdds,
  setBookieAwayOdds,
  bookieNoGoalOdds,
  setBookieNoGoalOdds,
  clearInputs,
}) {
  const result = useMemo(() => {
    const values = [homeOdds, drawOdds, awayOdds, nilNilOdds].map((v) => parseFloat(v));
    const hasRequired = values.every((v) => Number.isFinite(v) && v > 0);

    const bookieHome = parseFloat(bookieHomeOdds);
    const bookieAway = parseFloat(bookieAwayOdds);
    const bookieNoGoal = parseFloat(bookieNoGoalOdds);

    if (!hasRequired) {
      return {
        ready: false,
        homeFirstProb: null,
        awayFirstProb: null,
        noGoalProb: null,
        homeFirstOdds: null,
        awayFirstOdds: null,
        noGoalOdds: null,
        homeEv: null,
        awayEv: null,
        noGoalEv: null,
        bookieHome: Number.isFinite(bookieHome) && bookieHome > 0 ? bookieHome : null,
        bookieAway: Number.isFinite(bookieAway) && bookieAway > 0 ? bookieAway : null,
        bookieNoGoal: Number.isFinite(bookieNoGoal) && bookieNoGoal > 0 ? bookieNoGoal : null,
        homeXg: null,
        awayXg: null,
        totalXg: null,
      };
    }

    const [h, d, a, z] = values;
    const solved = solveMu(h, d, a, z);
    const muHome = solved.muHome;
    const muAway = solved.muAway;
    const muTotal = muHome + muAway;

    const noGoalProb = Math.exp(-muTotal);
    const anyGoalProb = 1 - noGoalProb;
    const homeFirstProb = muTotal > 0 ? (muHome / muTotal) * anyGoalProb : 0;
    const awayFirstProb = muTotal > 0 ? (muAway / muTotal) * anyGoalProb : 0;

    const homeFirstOdds = homeFirstProb > 0 ? 1 / homeFirstProb : null;
    const awayFirstOdds = awayFirstProb > 0 ? 1 / awayFirstProb : null;
    const noGoalOdds = noGoalProb > 0 ? 1 / noGoalProb : null;

    const homeEv = homeFirstOdds && Number.isFinite(bookieHome) && bookieHome > 0 ? ((bookieHome / homeFirstOdds) - 1) * 100 : null;
    const awayEv = awayFirstOdds && Number.isFinite(bookieAway) && bookieAway > 0 ? ((bookieAway / awayFirstOdds) - 1) * 100 : null;
    const noGoalEv = noGoalOdds && Number.isFinite(bookieNoGoal) && bookieNoGoal > 0 ? ((bookieNoGoal / noGoalOdds) - 1) * 100 : null;

    return {
      ready: true,
      homeFirstProb: homeFirstProb * 100,
      awayFirstProb: awayFirstProb * 100,
      noGoalProb: noGoalProb * 100,
      homeFirstOdds,
      awayFirstOdds,
      noGoalOdds,
      homeEv,
      awayEv,
      noGoalEv,
      bookieHome: Number.isFinite(bookieHome) && bookieHome > 0 ? bookieHome : null,
      bookieAway: Number.isFinite(bookieAway) && bookieAway > 0 ? bookieAway : null,
      bookieNoGoal: Number.isFinite(bookieNoGoal) && bookieNoGoal > 0 ? bookieNoGoal : null,
      homeXg: muHome,
      awayXg: muAway,
      totalXg: muTotal,
    };
  }, [homeOdds, drawOdds, awayOdds, nilNilOdds, bookieHomeOdds, bookieAwayOdds, bookieNoGoalOdds]);

  return (
    <ToolShell
      title="Team To Score First"
      subtitle="Use exchange match odds and the 0-0 line to compile fair prices for home team first, away team first, and no goal. Built for boosted and niche football markets where the exchange does not show a clean direct price."
      resultPanel={
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-zinc-400">Results</div>
              <div className="mt-1 text-2xl font-bold text-white">Model output</div>
            </div>
            <div className="rounded-2xl bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">Live calc</div>
          </div>

          {result.ready ? (
            <>
              <div className="space-y-4">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold text-white">Home scores first</div>
                    <div className="text-xs uppercase tracking-wide text-zinc-500">Main market</div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <ResultStat label="Probability" value={`${result.homeFirstProb.toFixed(2)}%`} />
                    <ResultStat label="Fair odds" value={result.homeFirstOdds.toFixed(2)} accent />
                    <ResultStat label="EV" value={result.homeEv !== null ? `${result.homeEv >= 0 ? "+" : ""}${result.homeEv.toFixed(1)}%` : "—"} accent={result.homeEv !== null && result.homeEv >= 0} />
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold text-white">Away scores first</div>
                    <div className="text-xs uppercase tracking-wide text-zinc-500">Derived market</div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <ResultStat label="Probability" value={`${result.awayFirstProb.toFixed(2)}%`} />
                    <ResultStat label="Fair odds" value={result.awayFirstOdds.toFixed(2)} />
                    <ResultStat label="EV" value={result.awayEv !== null ? `${result.awayEv >= 0 ? "+" : ""}${result.awayEv.toFixed(1)}%` : "—"} accent={result.awayEv !== null && result.awayEv >= 0} />
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold text-white">No goal</div>
                    <div className="text-xs uppercase tracking-wide text-zinc-500">Match ends 0-0</div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <ResultStat label="Probability" value={`${result.noGoalProb.toFixed(2)}%`} />
                    <ResultStat label="Fair odds" value={result.noGoalOdds.toFixed(2)} />
                    <ResultStat label="EV" value={result.noGoalEv !== null ? `${result.noGoalEv >= 0 ? "+" : ""}${result.noGoalEv.toFixed(1)}%` : "—"} accent={result.noGoalEv !== null && result.noGoalEv >= 0} />
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                <div className="text-xs uppercase tracking-wide text-zinc-500">Model breakdown</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div>
                    <div className="text-sm text-zinc-500">Home xG</div>
                    <div className="mt-1 text-lg font-semibold text-white">{result.homeXg.toFixed(3)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500">Away xG</div>
                    <div className="mt-1 text-lg font-semibold text-white">{result.awayXg.toFixed(3)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500">Total xG</div>
                    <div className="mt-1 text-lg font-semibold text-white">{result.totalXg.toFixed(3)}</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-sm leading-7 text-zinc-400">
              Enter the exchange prices on the left to generate fair odds for home first, away first, and no goal.
            </div>
          )}
        </div>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <InputField label="Home odds" placeholder="e.g. 2.34" value={homeOdds} onChange={setHomeOdds} hint="Exchange back or lay midpoint." />
        <InputField label="Draw odds" placeholder="e.g. 3.90" value={drawOdds} onChange={setDrawOdds} hint="Match odds help calibrate team strength." />
        <InputField label="Away odds" placeholder="e.g. 3.25" value={awayOdds} onChange={setAwayOdds} hint="Use the same source and market snapshot." />
        <InputField label="0-0 odds" placeholder="e.g. 8.00" value={nilNilOdds} onChange={setNilNilOdds} hint="Used to derive the no-goal probability and total xG." />
      </div>

      <div className="my-7 h-px bg-zinc-800" />

      <div>
        <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">Optional bookmaker prices</div>
        <div className="grid gap-5 sm:grid-cols-3">
          <InputField label="Home first odds" placeholder="e.g. 3.40" value={bookieHomeOdds} onChange={setBookieHomeOdds} hint="Optional EV comparison." />
          <InputField label="Away first odds" placeholder="e.g. 2.10" value={bookieAwayOdds} onChange={setBookieAwayOdds} hint="Optional EV comparison." />
          <InputField label="No goal odds" placeholder="e.g. 8.50" value={bookieNoGoalOdds} onChange={setBookieNoGoalOdds} hint="Optional EV comparison." />
        </div>
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        <button
          onClick={clearInputs}
          className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
        >
          Clear inputs
        </button>
      </div>
    </ToolShell>
  );
}

function FirstHalfBTTSPage({
  over05,
  setOver05,
  over15,
  setOver15,
  over25,
  setOver25,
  htHome,
  setHtHome,
  htDraw,
  setHtDraw,
  htAway,
  setHtAway,
  bookieOdds,
  setBookieOdds,
  clearInputs,
}) {
  const result = useMemo(() => {
    const requiredValues = [over05, over15, over25, htHome, htDraw, htAway].map((v) => parseFloat(v));
    const hasRequired = requiredValues.every((v) => Number.isFinite(v) && v > 0);
    const bookie = parseFloat(bookieOdds);

    if (!hasRequired) {
      return {
        ready: false,
        fair: null,
        prob: null,
        bookie: Number.isFinite(bookie) && bookie > 0 ? bookie : null,
        ev: null,
        totalXg: null,
        homeXg: null,
        awayXg: null,
      };
    }

    const [o05, o15, o25, h, d, a] = requiredValues;
    const totalFit = fitTotalFromOvers(o05, o15, o25);
    const splitFit = fitSplitFromHT1X2(totalFit.lambda, h, d, a);

    const homeXg = splitFit.muHome;
    const awayXg = splitFit.muAway;
    const prob = (1 - Math.exp(-homeXg)) * (1 - Math.exp(-awayXg));
    const fair = prob > 0 ? 1 / prob : null;
    const ev = fair && Number.isFinite(bookie) && bookie > 0 ? ((bookie / fair) - 1) * 100 : null;

    return {
      ready: true,
      fair,
      prob: prob * 100,
      bookie: Number.isFinite(bookie) && bookie > 0 ? bookie : null,
      ev,
      totalXg: totalFit.lambda,
      homeXg,
      awayXg,
    };
  }, [over05, over15, over25, htHome, htDraw, htAway, bookieOdds]);

  return (
    <ToolShell
      title="1st Half BTTS"
      subtitle="Use first-half goal lines and half-time 1X2 prices to estimate the fair odds for both teams to score in the first half. Ideal for specials and boosts that are difficult to value directly from exchange liquidity."
      resultPanel={
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-zinc-400">Results</div>
              <div className="mt-1 text-2xl font-bold text-white">Model output</div>
            </div>
            <div className="rounded-2xl bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">Live calc</div>
          </div>

          {result.ready ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultStat label="Fair odds" value={result.fair.toFixed(2)} accent />
                <ResultStat label="Probability" value={`${result.prob.toFixed(2)}%`} />
                <ResultStat label="Bookie odds" value={result.bookie ? result.bookie.toFixed(2) : "—"} />
                <ResultStat label="EV" value={result.ev !== null ? `${result.ev >= 0 ? "+" : ""}${result.ev.toFixed(1)}%` : "—"} accent={result.ev !== null && result.ev >= 0} />
              </div>

              <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                <div className="text-xs uppercase tracking-wide text-zinc-500">Model breakdown</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div>
                    <div className="text-sm text-zinc-500">1H total xG</div>
                    <div className="mt-1 text-lg font-semibold text-white">{result.totalXg.toFixed(3)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500">Home xG</div>
                    <div className="mt-1 text-lg font-semibold text-white">{result.homeXg.toFixed(3)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500">Away xG</div>
                    <div className="mt-1 text-lg font-semibold text-white">{result.awayXg.toFixed(3)}</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-sm leading-7 text-zinc-400">
              Enter the first-half exchange prices on the left to generate fair odds, probability, and optional EV.
            </div>
          )}
        </div>
      }
    >
      <div>
        <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">1H goal lines</div>
        <div className="grid gap-5 sm:grid-cols-3">
          <InputField label="Over 0.5" placeholder="e.g. 1.32" value={over05} onChange={setOver05} />
          <InputField label="Over 1.5" placeholder="e.g. 2.55" value={over15} onChange={setOver15} />
          <InputField label="Over 2.5" placeholder="e.g. 6.20" value={over25} onChange={setOver25} />
        </div>
      </div>

      <div className="my-7 h-px bg-zinc-800" />

      <div>
        <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">Half-time 1X2</div>
        <div className="grid gap-5 sm:grid-cols-3">
          <InputField label="Home" placeholder="e.g. 2.85" value={htHome} onChange={setHtHome} />
          <InputField label="Draw" placeholder="e.g. 2.04" value={htDraw} onChange={setHtDraw} />
          <InputField label="Away" placeholder="e.g. 6.80" value={htAway} onChange={setHtAway} />
        </div>
      </div>

      <div className="my-7 h-px bg-zinc-800" />

      <div className="grid gap-5 sm:grid-cols-2">
        <InputField
          label="Bookie odds"
          placeholder="e.g. 5.50"
          value={bookieOdds}
          onChange={setBookieOdds}
          hint="Optional. Enter the bookmaker price to compare against the compiled fair odds."
        />
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        <button
          onClick={clearInputs}
          className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
        >
          Clear inputs
        </button>
      </div>
    </ToolShell>
  );
}

function TeamToScoreBothHalvesPage({
  selectedTeam,
  setSelectedTeam,
  htOver05,
  setHtOver05,
  htHome,
  setHtHome,
  htDraw,
  setHtDraw,
  htAway,
  setHtAway,
  ftOver25,
  setFtOver25,
  ftHome,
  setFtHome,
  ftDraw,
  setFtDraw,
  ftAway,
  setFtAway,
  bookieOdds,
  setBookieOdds,
  clearInputs,
}) {
  const result = useMemo(() => {
    const requiredValues = [htOver05, htHome, htDraw, htAway, ftOver25, ftHome, ftDraw, ftAway].map((v) => parseFloat(v));
    const hasRequired = requiredValues.every((v) => Number.isFinite(v) && v > 0);
    const bookie = parseFloat(bookieOdds);

    if (!hasRequired) {
      return {
        ready: false,
        probability: null,
        fairOdds: null,
        ev: null,
        bookie: Number.isFinite(bookie) && bookie > 0 ? bookie : null,
        total1H: null,
        totalFt: null,
        total2H: null,
        team1H: null,
        team2H: null,
      };
    }

    const [o05ht, hth, htd, hta, o25ft, fth, ftd, fta] = requiredValues;
    const pOver05 = Math.min(0.999, Math.max(0.001, 1 / o05ht));
    const p00 = Math.max(0.001, 1 - pOver05);
    const total1H = -Math.log(p00);
    const htSplit = fitSplitFromHT1X2(total1H, hth, htd, hta);

    const ftTotalFit = fitTotalFromSingleOver(o25ft, 2.5);
    const totalFt = ftTotalFit.lambda;
    const total2H = Math.max(0.05, totalFt - total1H);

    const invFtSum = 1 / fth + 1 / ftd + 1 / fta;
    const pFtHome = (1 / fth) / invFtSum;
    const pFtAway = (1 / fta) / invFtSum;
    const ftShare = pFtHome + pFtAway > 0 ? pFtHome / (pFtHome + pFtAway) : 0.5;

    const home1H = htSplit.muHome;
    const away1H = htSplit.muAway;
    const home2H = total2H * ftShare;
    const away2H = total2H * (1 - ftShare);

    const team1H = selectedTeam === "home" ? home1H : away1H;
    const team2H = selectedTeam === "home" ? home2H : away2H;
    const pScore1H = 1 - Math.exp(-team1H);
    const pScore2H = 1 - Math.exp(-team2H);
    const probability = pScore1H * pScore2H;
    const fairOdds = probability > 0 ? 1 / probability : null;
    const ev = fairOdds && Number.isFinite(bookie) && bookie > 0 ? ((bookie / fairOdds) - 1) * 100 : null;

    return {
      ready: true,
      probability: probability * 100,
      fairOdds,
      ev,
      bookie: Number.isFinite(bookie) && bookie > 0 ? bookie : null,
      total1H,
      totalFt,
      total2H,
      team1H,
      team2H,
    };
  }, [selectedTeam, htOver05, htHome, htDraw, htAway, ftOver25, ftHome, ftDraw, ftAway, bookieOdds]);

  return (
    <ToolShell
      title="Team To Score In Both Halves"
      subtitle="Use HT Over 0.5, HT 1X2, FT Over 2.5, and FT 1X2 to estimate the fair odds for the home or away team to score in both halves."
      resultPanel={
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-zinc-400">Results</div>
              <div className="mt-1 text-2xl font-bold text-white">Model output</div>
            </div>
            <div className="rounded-2xl bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">Live calc</div>
          </div>

          {result.ready ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultStat label="Fair odds" value={result.fairOdds.toFixed(2)} accent />
                <ResultStat label="Probability" value={`${result.probability.toFixed(2)}%`} />
                <ResultStat label="Bookie odds" value={result.bookie ? result.bookie.toFixed(2) : "—"} />
                <ResultStat label="EV" value={result.ev !== null ? `${result.ev >= 0 ? "+" : ""}${result.ev.toFixed(1)}%` : "—"} accent={result.ev !== null && result.ev >= 0} />
              </div>

              <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                <div className="text-xs uppercase tracking-wide text-zinc-500">Model breakdown</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-5">
                  <div>
                    <div className="text-sm text-zinc-500">1H total xG</div>
                    <div className="mt-1 text-lg font-semibold text-white">{result.total1H.toFixed(3)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500">FT total xG</div>
                    <div className="mt-1 text-lg font-semibold text-white">{result.totalFt.toFixed(3)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500">2H total xG</div>
                    <div className="mt-1 text-lg font-semibold text-white">{result.total2H.toFixed(3)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500">Team 1H xG</div>
                    <div className="mt-1 text-lg font-semibold text-white">{result.team1H.toFixed(3)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500">Team 2H xG</div>
                    <div className="mt-1 text-lg font-semibold text-white">{result.team2H.toFixed(3)}</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-sm leading-7 text-zinc-400">
              Enter HT Over 0.5, HT 1X2, FT Over 2.5, and FT 1X2 to generate fair odds for the selected team to score in both halves.
            </div>
          )}
        </div>
      }
    >
      <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm leading-7 text-zinc-400">
        Use this when the bookmaker offers home or away team to score in both halves. The model fits first-half total xG
        from HT Over 0.5, splits the first half using HT 1X2, fits full-match total xG from FT Over 2.5, then uses FT
        1X2 as the second-half strength split.
      </div>

      <div className="mb-6">
        <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Team to price</div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setSelectedTeam("home")} className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${selectedTeam === "home" ? "bg-emerald-400 text-zinc-950" : "border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-white"}`}>Home</button>
          <button onClick={() => setSelectedTeam("away")} className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${selectedTeam === "away" ? "bg-emerald-400 text-zinc-950" : "border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-white"}`}>Away</button>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <InputField label="HT Over 0.5" placeholder="e.g. 1.45" value={htOver05} onChange={setHtOver05} hint="Used to infer total first-half xG." />
        <InputField label="FT Over 2.5" placeholder="e.g. 2.10" value={ftOver25} onChange={setFtOver25} hint="Used to fit total full-match xG by Poisson inversion." />
      </div>

      <div className="my-7 h-px bg-zinc-800" />

      <div>
        <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">Half-time 1X2</div>
        <div className="grid gap-5 sm:grid-cols-3">
          <InputField label="Home" placeholder="e.g. 2.85" value={htHome} onChange={setHtHome} />
          <InputField label="Draw" placeholder="e.g. 2.04" value={htDraw} onChange={setHtDraw} />
          <InputField label="Away" placeholder="e.g. 6.80" value={htAway} onChange={setHtAway} />
        </div>
      </div>

      <div className="my-7 h-px bg-zinc-800" />

      <div>
        <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">Full-time 1X2</div>
        <div className="grid gap-5 sm:grid-cols-3">
          <InputField label="Home" placeholder="e.g. 1.75" value={ftHome} onChange={setFtHome} />
          <InputField label="Draw" placeholder="e.g. 3.90" value={ftDraw} onChange={setFtDraw} />
          <InputField label="Away" placeholder="e.g. 5.50" value={ftAway} onChange={setFtAway} />
        </div>
      </div>

      <div className="my-7 h-px bg-zinc-800" />

      <div className="grid gap-5 sm:grid-cols-2">
        <InputField label="Bookie odds" placeholder="e.g. 3.75" value={bookieOdds} onChange={setBookieOdds} hint="Optional. Enter the bookmaker price to compare against the compiled fair odds." />
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        <button onClick={clearInputs} className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900">Clear inputs</button>
      </div>
    </ToolShell>
  );
}

function TeamToScore1HPage({
  selectedTeam,
  setSelectedTeam,
  over05,
  setOver05,
  over15,
  setOver15,
  over25,
  setOver25,
  htHome,
  setHtHome,
  htDraw,
  setHtDraw,
  htAway,
  setHtAway,
  bookieOdds,
  setBookieOdds,
  clearInputs,
}) {
  const result = useMemo(() => {
    const requiredValues = [over05, htHome, htDraw, htAway].map((v) => parseFloat(v));
    const hasRequired = requiredValues.every((v) => Number.isFinite(v) && v > 0);
    const bookie = parseFloat(bookieOdds);

    if (!hasRequired) {
      return {
        ready: false,
        probability: null,
        fairOdds: null,
        ev: null,
        bookie: Number.isFinite(bookie) && bookie > 0 ? bookie : null,
        totalXg: null,
        homeXg: null,
        awayXg: null,
      };
    }

    const [o05, h, d, a] = requiredValues;
    const pOver05 = Math.min(0.999, Math.max(0.001, 1 / o05));
    const p00 = Math.max(0.001, 1 - pOver05);
    const totalXg = -Math.log(p00);
    const splitFit = fitSplitFromHT1X2(totalXg, h, d, a);
    const homeXg = splitFit.muHome;
    const awayXg = splitFit.muAway;
    const teamXg = selectedTeam === "home" ? homeXg : awayXg;
    const probability = 1 - Math.exp(-teamXg);
    const fairOdds = probability > 0 ? 1 / probability : null;
    const ev = fairOdds && Number.isFinite(bookie) && bookie > 0 ? ((bookie / fairOdds) - 1) * 100 : null;

    return {
      ready: true,
      probability: probability * 100,
      fairOdds,
      ev,
      bookie: Number.isFinite(bookie) && bookie > 0 ? bookie : null,
      totalXg,
      homeXg,
      awayXg,
    };
  }, [selectedTeam, over05, htHome, htDraw, htAway, bookieOdds]);

  return (
    <ToolShell
      title="Team To Score In The First Half"
      subtitle="Use HT Over 0.5 and half-time 1X2 prices to estimate the fair odds for the home or away team to score at least once in the first half."
      resultPanel={
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-zinc-400">Results</div>
              <div className="mt-1 text-2xl font-bold text-white">Model output</div>
            </div>
            <div className="rounded-2xl bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">Live calc</div>
          </div>

          {result.ready ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultStat label="Fair odds" value={result.fairOdds.toFixed(2)} accent />
                <ResultStat label="Probability" value={`${result.probability.toFixed(2)}%`} />
                <ResultStat label="Bookie odds" value={result.bookie ? result.bookie.toFixed(2) : "—"} />
                <ResultStat label="EV" value={result.ev !== null ? `${result.ev >= 0 ? "+" : ""}${result.ev.toFixed(1)}%` : "—"} accent={result.ev !== null && result.ev >= 0} />
              </div>

              <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                <div className="text-xs uppercase tracking-wide text-zinc-500">Model breakdown</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div>
                    <div className="text-sm text-zinc-500">1H total xG</div>
                    <div className="mt-1 text-lg font-semibold text-white">{result.totalXg.toFixed(3)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500">Home 1H xG</div>
                    <div className="mt-1 text-lg font-semibold text-white">{result.homeXg.toFixed(3)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500">Away 1H xG</div>
                    <div className="mt-1 text-lg font-semibold text-white">{result.awayXg.toFixed(3)}</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-sm leading-7 text-zinc-400">
              Enter HT Over 0.5 and HT 1X2 prices to generate fair odds for the selected team to score in the first half.
            </div>
          )}
        </div>
      }
    >
      <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm leading-7 text-zinc-400">
        Use this when the bookmaker offers home or away team to score in the first half. The model uses HT Over 0.5 to
        infer total first-half xG, then splits that total using HT 1X2.
      </div>

      <div className="mb-6">
        <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Team to price</div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedTeam("home")}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${selectedTeam === "home" ? "bg-emerald-400 text-zinc-950" : "border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-white"}`}
          >
            Home
          </button>
          <button
            onClick={() => setSelectedTeam("away")}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${selectedTeam === "away" ? "bg-emerald-400 text-zinc-950" : "border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-white"}`}
          >
            Away
          </button>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <InputField label="HT Over 0.5" placeholder="e.g. 1.45" value={over05} onChange={setOver05} hint="Used to infer total first-half xG via the no-goal probability." />
      </div>

      <div className="my-7 h-px bg-zinc-800" />

      <div>
        <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">Half-time 1X2</div>
        <div className="grid gap-5 sm:grid-cols-3">
          <InputField label="Home" placeholder="e.g. 2.85" value={htHome} onChange={setHtHome} />
          <InputField label="Draw" placeholder="e.g. 2.04" value={htDraw} onChange={setHtDraw} />
          <InputField label="Away" placeholder="e.g. 6.80" value={htAway} onChange={setHtAway} />
        </div>
      </div>

      <div className="my-7 h-px bg-zinc-800" />

      <div className="grid gap-5 sm:grid-cols-2">
        <InputField
          label="Bookie odds"
          placeholder="e.g. 1.95"
          value={bookieOdds}
          onChange={setBookieOdds}
          hint="Optional. Enter the bookmaker price to compare against the compiled fair odds."
        />
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        <button
          onClick={clearInputs}
          className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
        >
          Clear inputs
        </button>
      </div>
    </ToolShell>
  );
}

function XOrYOrZPage({
  label1,
  setLabel1,
  odds1,
  setOdds1,
  label2,
  setLabel2,
  odds2,
  setOdds2,
  label3,
  setLabel3,
  odds3,
  setOdds3,
  label4,
  setLabel4,
  odds4,
  setOdds4,
  label5,
  setLabel5,
  odds5,
  setOdds5,
  bookieOdds,
  setBookieOdds,
  clearInputs,
}) {
  const rows = [
    { label: label1, setLabel: setLabel1, odds: odds1, setOdds: setOdds1 },
    { label: label2, setLabel: setLabel2, odds: odds2, setOdds: setOdds2 },
    { label: label3, setLabel: setLabel3, odds: odds3, setOdds: setOdds3 },
    { label: label4, setLabel: setLabel4, odds: odds4, setOdds: setOdds4 },
    { label: label5, setLabel: setLabel5, odds: odds5, setOdds: setOdds5 },
  ];

  const result = useMemo(() => {
    const parsedSelections = rows
      .map((row, index) => ({
        label: row.label.trim(),
        displayLabel: row.label.trim() || `Selection ${index + 1}`,
        odds: parseFloat(row.odds),
      }))
      .filter((row) => Number.isFinite(row.odds) && row.odds > 0);

    const bookie = parseFloat(bookieOdds);

    if (parsedSelections.length === 0) {
      return {
        ready: false,
        selections: [],
        combinedProbability: null,
        fairOdds: null,
        bookie: Number.isFinite(bookie) && bookie > 0 ? bookie : null,
        ev: null,
      };
    }

    const combinedProbability = parsedSelections.reduce((sum, row) => sum + 1 / row.odds, 0);
    const fairOdds = combinedProbability > 0 ? 1 / combinedProbability : null;
    const ev = fairOdds && Number.isFinite(bookie) && bookie > 0 ? ((bookie / fairOdds) - 1) * 100 : null;

    return {
      ready: true,
      selections: parsedSelections,
      combinedProbability: combinedProbability * 100,
      fairOdds,
      bookie: Number.isFinite(bookie) && bookie > 0 ? bookie : null,
      ev,
    };
  }, [label1, odds1, label2, odds2, label3, odds3, label4, odds4, label5, odds5, bookieOdds]);

  return (
    <ToolShell
      title="X or Y or Z Calculator"
      subtitle="Combine fair odds for selections where only one outcome can win. Useful for correct-score groups like 1-0, 2-0, or 3-0, or named runners such as one of several horses or golfers to win."
      resultPanel={
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-zinc-400">Results</div>
              <div className="mt-1 text-2xl font-bold text-white">Combined fair odds</div>
            </div>
            <div className="rounded-2xl bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">Live calc</div>
          </div>

          {result.ready ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultStat label="Fair odds" value={result.fairOdds.toFixed(2)} accent />
                <ResultStat label="Combined probability" value={`${result.combinedProbability.toFixed(2)}%`} />
                <ResultStat label="Bookie odds" value={result.bookie ? result.bookie.toFixed(2) : "—"} />
                <ResultStat label="EV" value={result.ev !== null ? `${result.ev >= 0 ? "+" : ""}${result.ev.toFixed(1)}%` : "—"} accent={result.ev !== null && result.ev >= 0} />
              </div>

              <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                <div className="text-xs uppercase tracking-wide text-zinc-500">Included selections</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.selections.map((selection, index) => (
                    <div key={`${selection.displayLabel}-${index}`} className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm text-zinc-200">
                      {selection.displayLabel} @ {selection.odds.toFixed(2)}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-sm leading-7 text-zinc-400">
              Enter one or more mutually exclusive selections on the left to generate combined fair odds and optional EV.
            </div>
          )}
        </div>
      }
    >
      <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm leading-7 text-zinc-400">
        Use this when only one listed outcome can win. Good examples are Man City 1-0, 2-0, or 3-0, or one of two horses
        or one of three golfers to win. Labels are optional, so you can enter only the odds if you want to work quickly.
        Do not use it for overlapping bets like team to win and over 2.5 goals.
      </div>

      <div className="space-y-4">
        {rows.map((row, index) => (
          <div key={index} className="grid gap-4 sm:grid-cols-[1.4fr_0.8fr]">
            <InputField
              label={`Selection ${index + 1}`}
              placeholder={index === 0 ? "Optional, e.g. Man City 1-0" : "Optional"}
              value={row.label}
              onChange={row.setLabel}
            />
            <InputField
              label="Exchange odds"
              placeholder="e.g. 8.50"
              value={row.odds}
              onChange={row.setOdds}
            />
          </div>
        ))}
      </div>

      <div className="my-7 h-px bg-zinc-800" />

      <div className="grid gap-5 sm:grid-cols-2">
        <InputField
          label="Bookie odds"
          placeholder="e.g. 5.75"
          value={bookieOdds}
          onChange={setBookieOdds}
          hint="Optional. Enter the bookmaker X or Y or Z price to see EV."
        />
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        <button
          onClick={clearInputs}
          className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
        >
          Clear inputs
        </button>
      </div>
    </ToolShell>
  );
}

function SpecialsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
      <Card className="p-8 sm:p-10">
        <div className="mb-4 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
          More calculators coming soon
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Specials & boosted markets</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-400">
          This section is ready for additional market-specific models such as score both halves, win to nil, and other
          boosted football specials that need several exchange inputs to compile a fair price.
        </p>
      </Card>
    </div>
  );
}

export default function BoostCheckerHomepage() {
  const [page, setPage] = useState("home");

  const [teamToScoreFirst, setTeamToScoreFirst] = useState({
    homeOdds: "",
    drawOdds: "",
    awayOdds: "",
    nilNilOdds: "",
    bookieHomeOdds: "",
    bookieAwayOdds: "",
    bookieNoGoalOdds: "",
  });

  const [firstHalfBTTS, setFirstHalfBTTS] = useState({
    over05: "",
    over15: "",
    over25: "",
    htHome: "",
    htDraw: "",
    htAway: "",
    bookieOdds: "",
  });

  const [xOrYOrZ, setXOrYOrZ] = useState({
    label1: "",
    odds1: "",
    label2: "",
    odds2: "",
    label3: "",
    odds3: "",
    label4: "",
    odds4: "",
    label5: "",
    odds5: "",
    bookieOdds: "",
  });

  const [teamToScore1H, setTeamToScore1H] = useState({
    selectedTeam: "home",
    over05: "",
    htHome: "",
    htDraw: "",
    htAway: "",
    bookieOdds: "",
  });

  const [teamToScoreBothHalves, setTeamToScoreBothHalves] = useState({
    selectedTeam: "home",
    htOver05: "",
    htHome: "",
    htDraw: "",
    htAway: "",
    ftOver25: "",
    ftHome: "",
    ftDraw: "",
    ftAway: "",
    bookieOdds: "",
  });

  const clearTeamToScoreFirst = () => {
    setTeamToScoreFirst({
      homeOdds: "",
      drawOdds: "",
      awayOdds: "",
      nilNilOdds: "",
      bookieHomeOdds: "",
      bookieAwayOdds: "",
      bookieNoGoalOdds: "",
    });
  };

  const clearFirstHalfBTTS = () => {
    setFirstHalfBTTS({
      over05: "",
      over15: "",
      over25: "",
      htHome: "",
      htDraw: "",
      htAway: "",
      bookieOdds: "",
    });
  };

  const clearXOrYOrZ = () => {
    setXOrYOrZ({
      label1: "",
      odds1: "",
      label2: "",
      odds2: "",
      label3: "",
      odds3: "",
      label4: "",
      odds4: "",
      label5: "",
      odds5: "",
      bookieOdds: "",
    });
  };

  const clearTeamToScore1H = () => {
    setTeamToScore1H({
      selectedTeam: "home",
      over05: "",
      htHome: "",
      htDraw: "",
      htAway: "",
      bookieOdds: "",
    });
  };

  const clearTeamToScoreBothHalves = () => {
    setTeamToScoreBothHalves({
      selectedTeam: "home",
      htOver05: "",
      htHome: "",
      htDraw: "",
      htAway: "",
      ftOver25: "",
      ftHome: "",
      ftDraw: "",
      ftAway: "",
      bookieOdds: "",
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <button onClick={() => setPage("home")} className="flex items-center gap-3 text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-400/30">
              <span className="text-lg font-black tracking-tight text-emerald-300">BC</span>
            </div>
            <div>
              <div className="text-xl font-semibold tracking-tight">BoostChecker</div>
              <div className="text-xs text-zinc-400">Manual fair-odds tools for boosted football markets</div>
            </div>
          </button>

          <nav className="flex flex-wrap gap-2">
            {[
              ["home", "Home"],
              ["team-to-score-first", "Team To Score First"],
              ["1h-btts", "1st Half BTTS"],
              ["team-to-score-1h", "Score In 1st Half"],
              ["team-to-score-both-halves", "Score In Both Halves"],
              ["x-or-y-or-z", "X or Y or Z"],
              ["specials", "Specials"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setPage(key)}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${page === key ? "bg-emerald-400 text-zinc-950" : "border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-white"}`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "team-to-score-first" && (
          <TeamToScoreFirstPage
            homeOdds={teamToScoreFirst.homeOdds}
            setHomeOdds={(value) => setTeamToScoreFirst((s) => ({ ...s, homeOdds: value }))}
            drawOdds={teamToScoreFirst.drawOdds}
            setDrawOdds={(value) => setTeamToScoreFirst((s) => ({ ...s, drawOdds: value }))}
            awayOdds={teamToScoreFirst.awayOdds}
            setAwayOdds={(value) => setTeamToScoreFirst((s) => ({ ...s, awayOdds: value }))}
            nilNilOdds={teamToScoreFirst.nilNilOdds}
            setNilNilOdds={(value) => setTeamToScoreFirst((s) => ({ ...s, nilNilOdds: value }))}
            bookieHomeOdds={teamToScoreFirst.bookieHomeOdds}
            setBookieHomeOdds={(value) => setTeamToScoreFirst((s) => ({ ...s, bookieHomeOdds: value }))}
            bookieAwayOdds={teamToScoreFirst.bookieAwayOdds}
            setBookieAwayOdds={(value) => setTeamToScoreFirst((s) => ({ ...s, bookieAwayOdds: value }))}
            bookieNoGoalOdds={teamToScoreFirst.bookieNoGoalOdds}
            setBookieNoGoalOdds={(value) => setTeamToScoreFirst((s) => ({ ...s, bookieNoGoalOdds: value }))}
            clearInputs={clearTeamToScoreFirst}
          />
        )}
        {page === "1h-btts" && (
          <FirstHalfBTTSPage
            over05={firstHalfBTTS.over05}
            setOver05={(value) => setFirstHalfBTTS((s) => ({ ...s, over05: value }))}
            over15={firstHalfBTTS.over15}
            setOver15={(value) => setFirstHalfBTTS((s) => ({ ...s, over15: value }))}
            over25={firstHalfBTTS.over25}
            setOver25={(value) => setFirstHalfBTTS((s) => ({ ...s, over25: value }))}
            htHome={firstHalfBTTS.htHome}
            setHtHome={(value) => setFirstHalfBTTS((s) => ({ ...s, htHome: value }))}
            htDraw={firstHalfBTTS.htDraw}
            setHtDraw={(value) => setFirstHalfBTTS((s) => ({ ...s, htDraw: value }))}
            htAway={firstHalfBTTS.htAway}
            setHtAway={(value) => setFirstHalfBTTS((s) => ({ ...s, htAway: value }))}
            bookieOdds={firstHalfBTTS.bookieOdds}
            setBookieOdds={(value) => setFirstHalfBTTS((s) => ({ ...s, bookieOdds: value }))}
            clearInputs={clearFirstHalfBTTS}
          />
        )}
        {page === "team-to-score-1h" && (
          <TeamToScore1HPage
            selectedTeam={teamToScore1H.selectedTeam}
            setSelectedTeam={(value) => setTeamToScore1H((s) => ({ ...s, selectedTeam: value }))}
            over05={teamToScore1H.over05}
            setOver05={(value) => setTeamToScore1H((s) => ({ ...s, over05: value }))}
            over15={teamToScore1H.over15}
            setOver15={(value) => setTeamToScore1H((s) => ({ ...s, over15: value }))}
            over25={teamToScore1H.over25}
            setOver25={(value) => setTeamToScore1H((s) => ({ ...s, over25: value }))}
            htHome={teamToScore1H.htHome}
            setHtHome={(value) => setTeamToScore1H((s) => ({ ...s, htHome: value }))}
            htDraw={teamToScore1H.htDraw}
            setHtDraw={(value) => setTeamToScore1H((s) => ({ ...s, htDraw: value }))}
            htAway={teamToScore1H.htAway}
            setHtAway={(value) => setTeamToScore1H((s) => ({ ...s, htAway: value }))}
            bookieOdds={teamToScore1H.bookieOdds}
            setBookieOdds={(value) => setTeamToScore1H((s) => ({ ...s, bookieOdds: value }))}
            clearInputs={clearTeamToScore1H}
          />
        )}
        {page === "team-to-score-both-halves" && (
          <TeamToScoreBothHalvesPage
            selectedTeam={teamToScoreBothHalves.selectedTeam}
            setSelectedTeam={(value) => setTeamToScoreBothHalves((s) => ({ ...s, selectedTeam: value }))}
            htOver05={teamToScoreBothHalves.htOver05}
            setHtOver05={(value) => setTeamToScoreBothHalves((s) => ({ ...s, htOver05: value }))}
            htHome={teamToScoreBothHalves.htHome}
            setHtHome={(value) => setTeamToScoreBothHalves((s) => ({ ...s, htHome: value }))}
            htDraw={teamToScoreBothHalves.htDraw}
            setHtDraw={(value) => setTeamToScoreBothHalves((s) => ({ ...s, htDraw: value }))}
            htAway={teamToScoreBothHalves.htAway}
            setHtAway={(value) => setTeamToScoreBothHalves((s) => ({ ...s, htAway: value }))}
            ftOver25={teamToScoreBothHalves.ftOver25}
            setFtOver25={(value) => setTeamToScoreBothHalves((s) => ({ ...s, ftOver25: value }))}
            ftHome={teamToScoreBothHalves.ftHome}
            setFtHome={(value) => setTeamToScoreBothHalves((s) => ({ ...s, ftHome: value }))}
            ftDraw={teamToScoreBothHalves.ftDraw}
            setFtDraw={(value) => setTeamToScoreBothHalves((s) => ({ ...s, ftDraw: value }))}
            ftAway={teamToScoreBothHalves.ftAway}
            setFtAway={(value) => setTeamToScoreBothHalves((s) => ({ ...s, ftAway: value }))}
            bookieOdds={teamToScoreBothHalves.bookieOdds}
            setBookieOdds={(value) => setTeamToScoreBothHalves((s) => ({ ...s, bookieOdds: value }))}
            clearInputs={clearTeamToScoreBothHalves}
          />
        )}
        {page === "x-or-y-or-z" && (
          <XOrYOrZPage
            label1={xOrYOrZ.label1}
            setLabel1={(value) => setXOrYOrZ((s) => ({ ...s, label1: value }))}
            odds1={xOrYOrZ.odds1}
            setOdds1={(value) => setXOrYOrZ((s) => ({ ...s, odds1: value }))}
            label2={xOrYOrZ.label2}
            setLabel2={(value) => setXOrYOrZ((s) => ({ ...s, label2: value }))}
            odds2={xOrYOrZ.odds2}
            setOdds2={(value) => setXOrYOrZ((s) => ({ ...s, odds2: value }))}
            label3={xOrYOrZ.label3}
            setLabel3={(value) => setXOrYOrZ((s) => ({ ...s, label3: value }))}
            odds3={xOrYOrZ.odds3}
            setOdds3={(value) => setXOrYOrZ((s) => ({ ...s, odds3: value }))}
            label4={xOrYOrZ.label4}
            setLabel4={(value) => setXOrYOrZ((s) => ({ ...s, label4: value }))}
            odds4={xOrYOrZ.odds4}
            setOdds4={(value) => setXOrYOrZ((s) => ({ ...s, odds4: value }))}
            label5={xOrYOrZ.label5}
            setLabel5={(value) => setXOrYOrZ((s) => ({ ...s, label5: value }))}
            odds5={xOrYOrZ.odds5}
            setOdds5={(value) => setXOrYOrZ((s) => ({ ...s, odds5: value }))}
            bookieOdds={xOrYOrZ.bookieOdds}
            setBookieOdds={(value) => setXOrYOrZ((s) => ({ ...s, bookieOdds: value }))}
            clearInputs={clearXOrYOrZ}
          />
        )}
        {page === "specials" && <SpecialsPage />}
      </main>

      <footer className="border-t border-zinc-800 bg-zinc-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
          <div>© 2026 BoostChecker</div>
          <div className="max-w-3xl">
            Fair odds shown by BoostChecker are model-based estimates built from exchange prices and should be treated as
            pricing tools, not guarantees.
          </div>
        </div>
      </footer>
    </div>
  );
}
