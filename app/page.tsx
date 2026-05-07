// @ts-nocheck
"use client";
import { useMemo, useState } from "react";

function Card({ children, className = "" }) {
  return <div className={`rounded-3xl border border-zinc-800 bg-zinc-900/60 ${className}`}>{children}</div>;
}

function InputField({ label, value, onChange, placeholder, hint, tabIndex, prefix, suffix }) {
  return (
    <label className="block">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-300">{label}</div>
      <div className="flex overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 focus-within:border-emerald-400/50 focus-within:ring-2 focus-within:ring-emerald-400/10">
        {prefix ? <div className="flex items-center border-r border-zinc-700 px-3 text-sm text-zinc-400">{prefix}</div> : null}
        <input
          tabIndex={tabIndex}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode="decimal"
          className="w-full bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
        />
        {suffix ? <div className="flex items-center border-l border-zinc-700 px-3 text-sm text-zinc-400">{suffix}</div> : null}
      </div>
      {hint ? <div className="mt-2 text-xs leading-5 text-zinc-500">{hint}</div> : null}
    </label>
  );
}

function ResultBox({ label, value, accent = false }) {
  return (
    <div className={`rounded-2xl border px-4 py-4 ${accent ? "border-emerald-400/25 bg-emerald-400/10" : "border-zinc-800 bg-zinc-950/70"}`}>
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div className={`mt-2 text-2xl font-bold ${accent ? "text-emerald-300" : "text-white"}`}>{value}</div>
    </div>
  );
}

function money(value) {
  if (!Number.isFinite(value)) return "—";
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}£${Math.abs(value).toFixed(2)}`;
}

function moneyNoSign(value) {
  if (!Number.isFinite(value)) return "—";
  return `£${Math.abs(value).toFixed(2)}`;
}

function numberOrZero(value) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function numberOrNull(value) {
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function calculateStandard({ backStake, backOdds, layOdds, backCommission, layCommission }) {
  const bs = numberOrNull(backStake);
  const bo = numberOrNull(backOdds);
  const lo = numberOrNull(layOdds);
  const bc = numberOrZero(backCommission) / 100;
  const lc = numberOrZero(layCommission) / 100;

  if (!bs || !bo || !lo) return null;

  const backWinProfitAfterCommission = bs * (bo - 1) * (1 - bc);

  // Equal-profit lay stake:
  // back win profit - liability = lay win profit - back stake
  const regularLayStake = (bs * ((bo - 1) * (1 - bc) + 1)) / (lo - lc);
  const regularLiability = regularLayStake * (lo - 1);
  const regularProfitIfBackWins = backWinProfitAfterCommission - regularLiability;
  const regularProfitIfLayWins = regularLayStake * (1 - lc) - bs;
  const regularProfit = Math.min(regularProfitIfBackWins, regularProfitIfLayWins);

  // Underlay: only cover the back stake if the lay side wins.
  const underlayLayStake = bs / (1 - lc);
  const underlayLiability = underlayLayStake * (lo - 1);
  const underlayProfitIfBackWins = backWinProfitAfterCommission - underlayLiability;
  const underlayProfitIfLayWins = underlayLayStake * (1 - lc) - bs;
  const underlayProfit = Math.min(underlayProfitIfBackWins, underlayProfitIfLayWins);

  return {
    regularLayStake,
    regularLiability,
    regularProfit,
    regularProfitIfBackWins,
    regularProfitIfLayWins,
    underlayLayStake,
    underlayLiability,
    underlayProfit,
    underlayProfitIfBackWins,
    underlayProfitIfLayWins,
  };
}

function calculateFreeBetSNR({ backStake, backOdds, layOdds, backCommission, layCommission, manualLayStake }) {
  const bs = numberOrNull(backStake);
  const bo = numberOrNull(backOdds);
  const lo = numberOrNull(layOdds);
  const bc = numberOrZero(backCommission) / 100;
  const lc = numberOrZero(layCommission) / 100;
  const manual = numberOrNull(manualLayStake);

  if (!bs || !bo || !lo) return null;

  const freeBetWinProfitAfterCommission = bs * (bo - 1) * (1 - bc);

  const regularLayStake = freeBetWinProfitAfterCommission / (lo - lc);
  const regularLiability = regularLayStake * (lo - 1);
  const regularProfitIfBackWins = freeBetWinProfitAfterCommission - regularLiability;
  const regularProfitIfLayWins = regularLayStake * (1 - lc);
  const regularProfit = Math.min(regularProfitIfBackWins, regularProfitIfLayWins);

  const underlayLayStake = manual || null;
  const underlayLiability = manual ? manual * (lo - 1) : null;
  const underlayProfitIfBackWins = manual ? freeBetWinProfitAfterCommission - underlayLiability : null;
  const underlayProfitIfLayWins = manual ? manual * (1 - lc) : null;
  const underlayProfit = manual ? Math.min(underlayProfitIfBackWins, underlayProfitIfLayWins) : null;

  return {
    regularLayStake,
    regularLiability,
    regularProfit,
    regularProfitIfBackWins,
    regularProfitIfLayWins,
    underlayLayStake,
    underlayLiability,
    underlayProfit,
    underlayProfitIfBackWins,
    underlayProfitIfLayWins,
  };
}

function CalculatorResults({ result, type, standardMode }) {
  if (!result) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-sm leading-7 text-zinc-400">
        Enter the stake and odds to calculate lay stake, liability, and profit.
      </div>
    );
  }

  const showUnderlay = type === "snr" || standardMode === "underlay";
  const prefix = showUnderlay ? "underlay" : "regular";
  const title = type === "snr" ? "Manual underlay" : showUnderlay ? "Underlay" : "Standard lay";

  if (type === "snr" && !Number.isFinite(result.underlayLayStake)) {
    return (
      <div className="space-y-6">
        <div>
          <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Regular lay</div>
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultBox label="Lay stake" value={moneyNoSign(result.regularLayStake)} accent />
            <ResultBox label="Liability" value={moneyNoSign(result.regularLiability)} />
            <ResultBox label="Profit" value={money(result.regularProfit)} accent={result.regularProfit >= 0} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 text-sm text-zinc-400">
              If back wins: <span className="font-semibold text-zinc-100">{money(result.regularProfitIfBackWins)}</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 text-sm text-zinc-400">
              If lay wins: <span className="font-semibold text-zinc-100">{money(result.regularProfitIfLayWins)}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Manual underlay</div>
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-sm leading-7 text-zinc-400">
            Enter a manual lay stake to see potential underlay profit.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">{title}</div>
      <div className="grid gap-4 sm:grid-cols-3">
        <ResultBox label="Lay stake" value={moneyNoSign(result[`${prefix}LayStake`])} accent />
        <ResultBox label="Liability" value={moneyNoSign(result[`${prefix}Liability`])} />
        <ResultBox label="Profit" value={money(result[`${prefix}Profit`])} accent={result[`${prefix}Profit`] >= 0} />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 text-sm text-zinc-400">
          If back wins: <span className="font-semibold text-zinc-100">{money(result[`${prefix}ProfitIfBackWins`])}</span>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 text-sm text-zinc-400">
          If lay wins: <span className="font-semibold text-zinc-100">{money(result[`${prefix}ProfitIfLayWins`])}</span>
        </div>
      </div>
    </div>
  );
}

function calculateDutching({ baseStake, oddsValues, commissionValues, betMode, dutchMode, showCommissions }) {
  const stake = numberOrNull(baseStake);
  const parsedOdds = oddsValues.map(numberOrNull);
  const marketComm = showCommissions && commissionMode === "market" ? numberOrZero(marketCommission) / 100 : 0;
  const commissions = commissionValues.map((value) => {
    if (!showCommissions) return 0;
    if (commissionMode === "market") return marketComm;
    return numberOrZero(value) / 100;
  });

  if (!stake || parsedOdds.some((odds) => !odds)) return null;

  const effectiveReturns = parsedOdds.map((odds, index) => {
    const comm = commissions[index] || 0;

    // In SNR mode, only selection 1 is the free bet. Other selections are normal real-money stakes.
    if (betMode === "snr" && index === 0) {
      return Math.max(0, odds - 1) * (1 - comm);
    }

    return 1 + (odds - 1) * (1 - comm);
  });

  if (effectiveReturns.some((ret) => ret <= 0)) return null;

  let stakes = [];
  let impossible = false;

  if (dutchMode === "underlay") {
    const inverseOtherReturns = effectiveReturns.slice(1).reduce((sum, ret) => sum + 1 / ret, 0);

    if (inverseOtherReturns >= 1) {
      impossible = true;
      stakes = [stake, ...effectiveReturns.slice(1).map(() => 0)];
    } else {
      const totalOutlay = stake / (1 - inverseOtherReturns);
      const breakEvenStakes = effectiveReturns.slice(1).map((ret) => totalOutlay / ret);
      stakes = [stake, ...breakEvenStakes];
    }
  } else {
    const targetReturn = stake * effectiveReturns[0];
    stakes = effectiveReturns.map((ret, i) => {
      if (i === 0) return stake;
      return targetReturn / ret;
    });
  }

  const totalStaked = stakes.reduce((sum, value) => sum + value, 0);
  const realOutlay = betMode === "snr" ? stakes.slice(1).reduce((sum, value) => sum + value, 0) : totalStaked;

  const rows = parsedOdds.map((odds, index) => {
    const selectionStake = stakes[index] || 0;
    const effectiveReturn = effectiveReturns[index];
    const returnValue = selectionStake * effectiveReturn;
    const profit = returnValue - realOutlay;

    return {
      index: index + 1,
      odds,
      commission: commissions[index] || 0,
      stake: selectionStake,
      returnValue,
      profit,
    };
  });

  return {
    impossible,
    totalStaked: realOutlay,
    rows,
    bestProfit: rows.reduce((max, row) => Math.max(max, row.profit), -Infinity),
    worstProfit: rows.reduce((min, row) => Math.min(min, row.profit), Infinity),
  };
}

function solveLinearSystem(matrix, vector) {
  const n = vector.length;
  const a = matrix.map((row, i) => [...row, vector[i]]);

  for (let col = 0; col < n; col += 1) {
    let pivot = col;
    for (let row = col + 1; row < n; row += 1) {
      if (Math.abs(a[row][col]) > Math.abs(a[pivot][col])) pivot = row;
    }

    if (Math.abs(a[pivot][col]) < 1e-10) return null;

    [a[col], a[pivot]] = [a[pivot], a[col]];

    const divisor = a[col][col];
    for (let j = col; j <= n; j += 1) a[col][j] /= divisor;

    for (let row = 0; row < n; row += 1) {
      if (row === col) continue;
      const factor = a[row][col];
      for (let j = col; j <= n; j += 1) a[row][j] -= factor * a[col][j];
    }
  }

  return a.map((row) => row[n]);
}

function calculateMultiLay({ bookieStake, bookieOdds, layOddsValues, commissionValues, marketCommission, commissionMode, betMode, layMode, showCommissions }) {
  const stake = numberOrNull(bookieStake);
  const bookie = numberOrNull(bookieOdds);
  const layOdds = layOddsValues.map(numberOrNull);
  const marketComm = showCommissions && commissionMode === "market" ? numberOrZero(marketCommission) / 100 : 0;
  const commissions = commissionValues.map((value) => {
    if (!showCommissions) return 0;
    if (commissionMode === "market") return marketComm;
    return numberOrZero(value) / 100;
  });

  if (!stake || !bookie || layOdds.some((odds) => !odds)) return null;

  const n = layOdds.length;
  const bookieWinProfit = stake * (bookie - 1);
  const bookieLoseProfit = betMode === "snr" ? 0 : -stake;

  const matrix = [];
  const vector = [];

  for (let i = 0; i < n; i += 1) {
    const row = Array.from({ length: n + 1 }, () => 0);
    for (let j = 0; j < n; j += 1) {
      const commissionMultiplier = 1 - (commissions[j] || 0);
      row[j] = i === j ? -(layOdds[j] - 1) : commissionMultiplier;
    }
    row[n] = -1;
    matrix.push(row);
    vector.push(-bookieWinProfit);
  }

  const noneRow = Array.from({ length: n + 1 }, () => 0);
  for (let j = 0; j < n; j += 1) noneRow[j] = 1 - (commissions[j] || 0);

  if (layMode === "underlay") {
    noneRow[n] = 0;
    matrix.push(noneRow);
    vector.push(-bookieLoseProfit);
  } else {
    noneRow[n] = -1;
    matrix.push(noneRow);
    vector.push(-bookieLoseProfit);
  }

  const solution = solveLinearSystem(matrix, vector);
  if (!solution) return null;

  const layStakes = solution.slice(0, n).map((value) => (Math.abs(value) < 0.000001 ? 0 : value));
  const targetProfit = solution[n];
  const impossible = layStakes.some((value) => value < -0.000001);

  const totalLayStake = layStakes.reduce((sum, value) => sum + Math.max(0, value), 0);
  const totalLiability = layStakes.reduce((sum, value, index) => sum + Math.max(0, value) * (layOdds[index] - 1), 0);

  const rows = layOdds.map((odds, index) => {
    const layStake = Math.max(0, layStakes[index]);
    const liability = layStake * (odds - 1);
    let layProfit = -liability;

    for (let j = 0; j < n; j += 1) {
      if (j === index) continue;
      layProfit += Math.max(0, layStakes[j]) * (1 - (commissions[j] || 0));
    }

    const profit = bookieWinProfit + layProfit;

    return {
      index: index + 1,
      odds,
      commission: commissions[index] || 0,
      layStake,
      liability,
      profit,
    };
  });

  const noSelectionProfit = bookieLoseProfit + layStakes.reduce((sum, value, index) => sum + Math.max(0, value) * (1 - (commissions[index] || 0)), 0);
  const profits = [...rows.map((row) => row.profit), noSelectionProfit];

  return {
    impossible,
    targetProfit,
    totalLayStake,
    totalLiability,
    noSelectionProfit,
    bestProfit: Math.max(...profits),
    worstProfit: Math.min(...profits),
    rows,
  };
}

function calculateSequentialLay({ backStake, backOdds, backCommission, layOddsValues, actualStakeValues, commissionValues, betMode, layMode, showCommissions }) {
  const stake = numberOrNull(backStake);
  const odds = numberOrNull(backOdds);
  const backComm = showCommissions ? numberOrZero(backCommission) / 100 : 0;
  const layOdds = layOddsValues.map(numberOrNull);
  const actualStakes = actualStakeValues.map(numberOrNull);
  const commissions = commissionValues.map((value) => (showCommissions ? numberOrZero(value) / 100 : 0));

  if (!stake || !odds || layOdds.some((value) => !value)) return null;

  const realBackOutlay = betMode === "snr" ? 0 : stake;
  const backWinProfit = stake * (odds - 1) * (1 - backComm);

  let previousLiability = 0;
  const rows = [];

  const solveRemainingEvenStakes = (startIndex, carriedLiability) => {
    const remainingCount = layOdds.length - startIndex;
    const matrix = [];
    const vector = [];

    for (let local = 0; local < remainingCount; local += 1) {
      const globalIndex = startIndex + local;
      const row = Array.from({ length: remainingCount + 1 }, () => 0);

      for (let j = 0; j < local; j += 1) {
        const previousGlobal = startIndex + j;
        row[j] = -(layOdds[previousGlobal] - 1);
      }

      row[local] = 1 - (commissions[globalIndex] || 0);
      row[remainingCount] = -1;
      matrix.push(row);
      vector.push(realBackOutlay + carriedLiability);
    }

    const allLoseRow = Array.from({ length: remainingCount + 1 }, () => 0);
    for (let local = 0; local < remainingCount; local += 1) {
      const globalIndex = startIndex + local;
      allLoseRow[local] = -(layOdds[globalIndex] - 1);
    }
    allLoseRow[remainingCount] = -1;
    matrix.push(allLoseRow);
    vector.push(-(backWinProfit - carriedLiability));

    const solution = solveLinearSystem(matrix, vector);
    return solution ? solution.slice(0, remainingCount) : null;
  };

  for (let index = 0; index < layOdds.length; index += 1) {
    const layOdd = layOdds[index];
    const layComm = commissions[index] || 0;

    let recommendedStake;
    if (layMode === "underlay") {
      recommendedStake = (realBackOutlay + previousLiability) / Math.max(0.000001, 1 - layComm);
    } else {
      const remainingStakes = solveRemainingEvenStakes(index, previousLiability);
      recommendedStake = remainingStakes ? remainingStakes[0] : 0;
    }

    const actualStake = actualStakes[index] || recommendedStake;
    const liability = actualStake * (layOdd - 1);
    const profitIfLayWins = actualStake * (1 - layComm) - realBackOutlay - previousLiability;

    previousLiability += liability;

    rows.push({
      index: index + 1,
      layOdds: layOdd,
      commission: layComm,
      recommendedStake,
      actualStake,
      liability,
      profitIfLayWins,
      cumulativeLiability: previousLiability,
    });
  }

  const profitIfAllLose = backWinProfit - previousLiability;
  const profits = [...rows.map((row) => row.profitIfLayWins), profitIfAllLose];

  return {
    rows,
    totalLiability: previousLiability,
    profitIfAllLose,
    bestProfit: Math.max(...profits),
    worstProfit: Math.min(...profits),
  };
}

function calculateMultiBackLay({
  stakeInput,
  stakeMode,
  backOddsValues,
  layOddsValues,
  backCommissionValues,
  layCommissionValues,
  backMarketCommission,
  layMarketCommission,
  backCommissionMode,
  layCommissionMode,
  hedgeMode,
  showCommissions,
}) {
  const inputStake = numberOrNull(stakeInput);
  const backOdds = backOddsValues.map(numberOrNull);
  const layOdds = layOddsValues.map(numberOrNull);
  const backMarketComm = showCommissions && backCommissionMode === "market" ? numberOrZero(backMarketCommission) / 100 : 0;
  const layMarketComm = showCommissions && layCommissionMode === "market" ? numberOrZero(layMarketCommission) / 100 : 0;
  const backComms = backCommissionValues.map((value) => {
    if (!showCommissions) return 0;
    if (backCommissionMode === "market") return backMarketComm;
    return numberOrZero(value) / 100;
  });
  const layComms = layCommissionValues.map((value) => {
    if (!showCommissions) return 0;
    if (layCommissionMode === "market") return layMarketComm;
    return numberOrZero(value) / 100;
  });

  if (!inputStake || backOdds.some((odds) => !odds) || layOdds.some((odds) => !odds)) return null;

  const effectiveBackReturns = backOdds.map((odds, index) => {
    const comm = backComms[index] || 0;
    return 1 + (odds - 1) * (1 - comm);
  });

  if (effectiveBackReturns.some((ret) => ret <= 0)) return null;

  let targetReturn;
  let backStakes;

  if (stakeMode === "total") {
    const inverseSum = effectiveBackReturns.reduce((sum, ret) => sum + 1 / ret, 0);
    targetReturn = inputStake / inverseSum;
    backStakes = effectiveBackReturns.map((ret) => targetReturn / ret);
  } else {
    targetReturn = inputStake * effectiveBackReturns[0];
    backStakes = effectiveBackReturns.map((ret, index) => (index === 0 ? inputStake : targetReturn / ret));
  }

  const backRows = backOdds.map((odds, index) => {
    const stake = backStakes[index];
    const effectiveReturn = effectiveBackReturns[index];
    return {
      index: index + 1,
      odds,
      commission: backComms[index] || 0,
      stake,
      returnValue: stake * effectiveReturn,
    };
  });

  const totalBackStake = backRows.reduce((sum, row) => sum + row.stake, 0);
  const syntheticOdds = targetReturn / totalBackStake;
  const bookieWinProfit = targetReturn - totalBackStake;
  const bookieLoseProfit = -totalBackStake;

  const n = layOdds.length;
  const matrix = [];
  const vector = [];

  for (let i = 0; i < n; i += 1) {
    const row = Array.from({ length: n + 1 }, () => 0);
    for (let j = 0; j < n; j += 1) {
      const commissionMultiplier = 1 - (layComms[j] || 0);
      row[j] = i === j ? -(layOdds[j] - 1) : commissionMultiplier;
    }
    row[n] = -1;
    matrix.push(row);
    vector.push(-bookieWinProfit);
  }

  const noneRow = Array.from({ length: n + 1 }, () => 0);
  for (let j = 0; j < n; j += 1) noneRow[j] = 1 - (layComms[j] || 0);

  if (hedgeMode === "underlay") {
    noneRow[n] = 0;
    matrix.push(noneRow);
    vector.push(-bookieLoseProfit);
  } else {
    noneRow[n] = -1;
    matrix.push(noneRow);
    vector.push(-bookieLoseProfit);
  }

  const solution = solveLinearSystem(matrix, vector);
  if (!solution) return null;

  const layStakesRaw = solution.slice(0, n).map((value) => (Math.abs(value) < 0.000001 ? 0 : value));
  const impossible = layStakesRaw.some((value) => value < -0.000001);
  const layStakes = layStakesRaw.map((value) => Math.max(0, value));

  const totalLayStake = layStakes.reduce((sum, value) => sum + value, 0);
  const totalLiability = layStakes.reduce((sum, value, index) => sum + value * (layOdds[index] - 1), 0);
  const combinedLayOdds = totalLayStake > 0 ? totalLiability / totalLayStake + 1 : null;

  const layRows = layOdds.map((odds, index) => {
    const layStake = layStakes[index];
    const liability = layStake * (odds - 1);
    let layProfit = -liability;

    for (let j = 0; j < n; j += 1) {
      if (j === index) continue;
      layProfit += layStakes[j] * (1 - (layComms[j] || 0));
    }

    const profit = bookieWinProfit + layProfit;

    return {
      index: index + 1,
      odds,
      commission: layComms[index] || 0,
      layStake,
      liability,
      profit,
    };
  });

  const noSelectionProfit = bookieLoseProfit + layStakes.reduce((sum, value, index) => sum + value * (1 - (layComms[index] || 0)), 0);
  const profits = [...layRows.map((row) => row.profit), noSelectionProfit];
  const bestProfit = Math.max(...profits);
  const worstProfit = Math.min(...profits);
  const totalOutlay = totalBackStake + totalLiability;
  const profitPercent = totalOutlay > 0 ? (worstProfit / totalOutlay) * 100 : null;

  return {
    impossible,
    backRows,
    layRows,
    totalBackStake,
    targetReturn,
    syntheticOdds,
    totalLayStake,
    totalLiability,
    combinedLayOdds,
    totalOutlay,
    profitPercent,
    noSelectionProfit,
    bestProfit,
    worstProfit,
  };
}

function MultiBackLayCalculator() {
  const [stakeInput, setStakeInput] = useState("");
  const [stakeMode, setStakeMode] = useState("selection1");
  const [backCount, setBackCount] = useState(2);
  const [layCount, setLayCount] = useState(1);
  const [backOddsValues, setBackOddsValues] = useState(Array.from({ length: 10 }, () => ""));
  const [layOddsValues, setLayOddsValues] = useState(Array.from({ length: 10 }, () => ""));
  const [backCommissionValues, setBackCommissionValues] = useState(Array.from({ length: 10 }, () => ""));
  const [layCommissionValues, setLayCommissionValues] = useState(Array.from({ length: 10 }, () => ""));
  const [backMarketCommission, setBackMarketCommission] = useState("");
  const [layMarketCommission, setLayMarketCommission] = useState("");
  const [backCommissionMode, setBackCommissionMode] = useState("individual");
  const [layCommissionMode, setLayCommissionMode] = useState("individual");
  const [hedgeMode, setHedgeMode] = useState("even");
  const [showCommissions, setShowCommissions] = useState(false);

  const visibleBackOdds = backOddsValues.slice(0, backCount);
  const visibleLayOdds = layOddsValues.slice(0, layCount);
  const visibleBackCommissions = backCommissionValues.slice(0, backCount);
  const visibleLayCommissions = layCommissionValues.slice(0, layCount);

  const result = useMemo(
    () => calculateMultiBackLay({
      stakeInput,
      stakeMode,
      backOddsValues: visibleBackOdds,
      layOddsValues: visibleLayOdds,
      backCommissionValues: visibleBackCommissions,
      layCommissionValues: visibleLayCommissions,
      backMarketCommission,
      layMarketCommission,
      backCommissionMode,
      layCommissionMode,
      hedgeMode,
      showCommissions,
    }),
    [stakeInput, stakeMode, visibleBackOdds, visibleLayOdds, visibleBackCommissions, visibleLayCommissions, backMarketCommission, layMarketCommission, backCommissionMode, layCommissionMode, hedgeMode, showCommissions]
  );

  const updateBackOdds = (index, value) => {
    setBackOddsValues((current) => current.map((item, i) => (i === index ? value : item)));
  };

  const updateLayOdds = (index, value) => {
    setLayOddsValues((current) => current.map((item, i) => (i === index ? value : item)));
  };

  const updateBackCommission = (index, value) => {
    setBackCommissionValues((current) => current.map((item, i) => (i === index ? value : item)));
  };

  const updateLayCommission = (index, value) => {
    setLayCommissionValues((current) => current.map((item, i) => (i === index ? value : item)));
  };

  const clearInputs = () => {
    setStakeInput("");
    setStakeMode("selection1");
    setBackCount(2);
    setLayCount(1);
    setBackOddsValues(Array.from({ length: 10 }, () => ""));
    setLayOddsValues(Array.from({ length: 10 }, () => ""));
    setBackCommissionValues(Array.from({ length: 10 }, () => ""));
    setLayCommissionValues(Array.from({ length: 10 }, () => ""));
    setBackMarketCommission("");
    setLayMarketCommission("");
    setBackCommissionMode("individual");
    setLayCommissionMode("individual");
    setHedgeMode("even");
    setShowCommissions(false);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <Card className="p-6 sm:p-7">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Multi Back Lay Calculator</h2>
          <p className="mt-2 text-sm leading-7 text-zinc-400">
            Combine multiple mutually exclusive back selections into one synthetic back price, then hedge with one or more lay selections.
          </p>
        </div>

        <div className="rounded-3xl border border-sky-400/30 bg-sky-400/10 p-5">
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <InputField
              label={stakeMode === "selection1" ? "Selection 1 stake" : "Total back stake"}
              placeholder=""
              value={stakeInput}
              onChange={setStakeInput}
              prefix="£"
              tabIndex={1}
            />

            <div className="flex flex-wrap gap-2">
              <div className="flex rounded-2xl border border-zinc-700 bg-zinc-950 p-1">
                <button
                  onClick={() => setStakeMode("selection1")}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${stakeMode === "selection1" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
                >
                  Selection 1 stake
                </button>
                <button
                  onClick={() => setStakeMode("total")}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${stakeMode === "total" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
                >
                  Total back stake
                </button>
              </div>

              <button
                onClick={() => setShowCommissions((current) => !current)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${showCommissions ? "bg-emerald-400 text-zinc-950" : "border border-zinc-700 bg-zinc-950 text-zinc-300 hover:text-white"}`}
              >
                {showCommissions ? "Hide commissions" : "Show commissions"}
              </button>
            </div>
          </div>

          {showCommissions ? (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-zinc-700 bg-zinc-950/70 p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-zinc-300">Back commission</div>
                  <div className="flex rounded-2xl border border-zinc-700 bg-zinc-950 p-1">
                    <button
                      onClick={() => setBackCommissionMode("individual")}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${backCommissionMode === "individual" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
                    >
                      Individual
                    </button>
                    <button
                      onClick={() => setBackCommissionMode("market")}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${backCommissionMode === "market" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
                    >
                      Market
                    </button>
                  </div>
                </div>
                {backCommissionMode === "market" ? (
                  <InputField label="Back market comm." placeholder="" value={backMarketCommission} onChange={setBackMarketCommission} suffix="%" tabIndex={2} />
                ) : (
                  <div className="text-xs leading-5 text-zinc-500">Individual mode shows commission boxes beside each back selection.</div>
                )}
              </div>

              <div className="rounded-2xl border border-zinc-700 bg-zinc-950/70 p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-zinc-300">Lay commission</div>
                  <div className="flex rounded-2xl border border-zinc-700 bg-zinc-950 p-1">
                    <button
                      onClick={() => setLayCommissionMode("individual")}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${layCommissionMode === "individual" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
                    >
                      Individual
                    </button>
                    <button
                      onClick={() => setLayCommissionMode("market")}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${layCommissionMode === "market" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
                    >
                      Market
                    </button>
                  </div>
                </div>
                {layCommissionMode === "market" ? (
                  <InputField label="Lay market comm." placeholder="" value={layMarketCommission} onChange={setLayMarketCommission} suffix="%" tabIndex={3} />
                ) : (
                  <div className="text-xs leading-5 text-zinc-500">Individual mode shows commission boxes beside each lay selection.</div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-5 rounded-3xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-300">Back selections</div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 10 }).map((_, index) => {
              const count = index + 1;
              return (
                <button
                  key={count}
                  onClick={() => setBackCount(count)}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${backCount === count ? "bg-emerald-400 text-zinc-950" : "border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white"}`}
                >
                  {count}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-sky-400/30 bg-sky-400/10 p-5">
          <div className="mb-4 text-sm font-bold uppercase tracking-wide text-sky-200">Back odds</div>
          <div className="grid gap-5 md:grid-cols-2">
            {visibleBackOdds.map((odds, index) => (
              <div key={index} className={`grid gap-3 ${showCommissions && backCommissionMode === "individual" ? "grid-cols-[1fr_0.7fr]" : "grid-cols-1"}`}>
                <InputField
                  label={`Back selection ${index + 1}`}
                  placeholder=""
                  value={odds}
                  onChange={(value) => updateBackOdds(index, value)}
                  tabIndex={index + 2}
                />
                {showCommissions && backCommissionMode === "individual" ? (
                  <InputField
                    label="Comm."
                    placeholder=""
                    value={backCommissionValues[index]}
                    onChange={(value) => updateBackCommission(index, value)}
                    suffix="%"
                    tabIndex={backCount + index + 2}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-300">Lay selections</div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 10 }).map((_, index) => {
              const count = index + 1;
              return (
                <button
                  key={count}
                  onClick={() => setLayCount(count)}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${layCount === count ? "bg-emerald-400 text-zinc-950" : "border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white"}`}
                >
                  {count}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-rose-400/30 bg-rose-400/10 p-5">
          <div className="mb-4 text-sm font-bold uppercase tracking-wide text-rose-200">Lay odds</div>
          <div className="grid gap-5 md:grid-cols-2">
            {visibleLayOdds.map((odds, index) => (
              <div key={index} className={`grid gap-3 ${showCommissions && layCommissionMode === "individual" ? "grid-cols-[1fr_0.7fr]" : "grid-cols-1"}`}>
                <InputField
                  label={`Lay selection ${index + 1}`}
                  placeholder=""
                  value={odds}
                  onChange={(value) => updateLayOdds(index, value)}
                  tabIndex={(showCommissions ? backCount * 2 : backCount) + index + 2}
                />
                {showCommissions && layCommissionMode === "individual" ? (
                  <InputField
                    label="Comm."
                    placeholder=""
                    value={layCommissionValues[index]}
                    onChange={(value) => updateLayCommission(index, value)}
                    suffix="%"
                    tabIndex={backCount * 2 + layCount + index + 2}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={clearInputs}
            className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            Clear inputs
          </button>

          <div className="flex rounded-2xl border border-zinc-700 bg-zinc-950 p-1">
            <button
              onClick={() => setHedgeMode("even")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${hedgeMode === "even" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
            >
              Even profit
            </button>
            <button
              onClick={() => setHedgeMode("underlay")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${hedgeMode === "underlay" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
            >
              Underlay
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-7">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-zinc-400">Results</div>
            <div className="mt-1 text-2xl font-bold text-white">Multi back / multi lay</div>
          </div>
          <div className="rounded-2xl bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">Live calc</div>
        </div>

        {!result ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-sm leading-7 text-zinc-400">
            Enter the stake, back odds, and lay odds to calculate the synthetic hedge.
          </div>
        ) : result.impossible ? (
          <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-6 text-sm leading-7 text-rose-100">
            This setup is not possible with the current odds. One or more lay stakes would need to be negative.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultBox label="Total back stake" value={moneyNoSign(result.totalBackStake)} />
              <ResultBox label="Combined odds" value={result.syntheticOdds.toFixed(2)} accent />
              <ResultBox label="Target return" value={moneyNoSign(result.targetReturn)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultBox label="Total lay stake" value={moneyNoSign(result.totalLayStake)} />
              <ResultBox label="Combined lay odds" value={result.combinedLayOdds ? result.combinedLayOdds.toFixed(2) : "—"} accent />
              <ResultBox label="Total liability" value={moneyNoSign(result.totalLiability)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultBox label="Total outlay" value={moneyNoSign(result.totalOutlay)} />
              <ResultBox label="Worst profit" value={money(result.worstProfit)} accent={result.worstProfit >= 0} />
              <ResultBox label="Profit % of outlay" value={result.profitPercent !== null ? `${result.profitPercent.toFixed(2)}%` : "—"} accent={result.profitPercent >= 0} />
            </div>
            <ResultBox label="If none of the lay selections win" value={money(result.noSelectionProfit)} accent={result.noSelectionProfit >= 0} />

            <div className="overflow-hidden rounded-2xl border border-zinc-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Back</th>
                    <th className="px-4 py-3">Odds</th>
                    {showCommissions ? <th className="px-4 py-3">Comm.</th> : null}
                    <th className="px-4 py-3">Stake</th>
                    <th className="px-4 py-3">Return</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 bg-zinc-900/40">
                  {result.backRows.map((row) => (
                    <tr key={row.index}>
                      <td className="px-4 py-3 font-semibold text-zinc-100">{row.index}</td>
                      <td className="px-4 py-3 text-zinc-300">{row.odds.toFixed(2)}</td>
                      {showCommissions ? <td className="px-4 py-3 text-zinc-300">{(row.commission * 100).toFixed(2)}%</td> : null}
                      <td className="px-4 py-3 text-zinc-300">{moneyNoSign(row.stake)}</td>
                      <td className="px-4 py-3 text-zinc-300">{moneyNoSign(row.returnValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Lay</th>
                    <th className="px-4 py-3">Odds</th>
                    {showCommissions ? <th className="px-4 py-3">Comm.</th> : null}
                    <th className="px-4 py-3">Stake</th>
                    <th className="px-4 py-3">Liability</th>
                    <th className="px-4 py-3">Profit if wins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 bg-zinc-900/40">
                  {result.layRows.map((row) => (
                    <tr key={row.index}>
                      <td className="px-4 py-3 font-semibold text-zinc-100">{row.index}</td>
                      <td className="px-4 py-3 text-zinc-300">{row.odds.toFixed(2)}</td>
                      {showCommissions ? <td className="px-4 py-3 text-zinc-300">{(row.commission * 100).toFixed(2)}%</td> : null}
                      <td className="px-4 py-3 text-zinc-300">{moneyNoSign(row.layStake)}</td>
                      <td className="px-4 py-3 text-zinc-300">{moneyNoSign(row.liability)}</td>
                      <td className={`px-4 py-3 font-semibold ${row.profit >= 0 ? "text-emerald-300" : "text-rose-300"}`}>{money(row.profit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function SequentialLayCalculator() {
  const [backStake, setBackStake] = useState("");
  const [backOdds, setBackOdds] = useState("");
  const [backCommission, setBackCommission] = useState("");
  const [legCount, setLegCount] = useState(2);
  const [betMode, setBetMode] = useState("standard");
  const [layMode, setLayMode] = useState("even");
  const [layOddsValues, setLayOddsValues] = useState(Array.from({ length: 6 }, () => ""));
  const [actualStakeValues, setActualStakeValues] = useState(Array.from({ length: 6 }, () => ""));
  const [commissionValues, setCommissionValues] = useState(Array.from({ length: 6 }, () => ""));
  const [showCommissions, setShowCommissions] = useState(false);

  const visibleLayOdds = layOddsValues.slice(0, legCount);
  const visibleActualStakes = actualStakeValues.slice(0, legCount);
  const visibleCommissions = commissionValues.slice(0, legCount);

  const result = useMemo(
    () =>
      calculateSequentialLay({
        backStake,
        backOdds,
        backCommission,
        layOddsValues: visibleLayOdds,
        actualStakeValues: visibleActualStakes,
        commissionValues: visibleCommissions,
        betMode,
        layMode,
        showCommissions,
      }),
    [backStake, backOdds, backCommission, visibleLayOdds, visibleActualStakes, visibleCommissions, betMode, layMode, showCommissions]
  );

  const updateLayOdds = (index, value) => {
    setLayOddsValues((current) => current.map((item, i) => (i === index ? value : item)));
  };

  const updateActualStake = (index, value) => {
    setActualStakeValues((current) => current.map((item, i) => (i === index ? value : item)));
  };

  const updateCommission = (index, value) => {
    setCommissionValues((current) => current.map((item, i) => (i === index ? value : item)));
  };

  const clearInputs = () => {
    setBackStake("");
    setBackOdds("");
    setBackCommission("");
    setLegCount(2);
    setBetMode("standard");
    setLayMode("even");
    setLayOddsValues(Array.from({ length: 6 }, () => ""));
    setActualStakeValues(Array.from({ length: 6 }, () => ""));
    setCommissionValues(Array.from({ length: 6 }, () => ""));
    setShowCommissions(false);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <Card className="p-6 sm:p-7">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Sequential Lay Calculator</h2>
          <p className="mt-2 text-sm leading-7 text-zinc-400">
            Calculate sequential lay stakes for a back bet or SNR free bet. Actual stake overrides flow into the next leg.
          </p>
        </div>

        <div className="rounded-3xl border border-sky-400/30 bg-sky-400/10 p-5">
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className={`grid flex-1 gap-5 ${showCommissions ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
              <InputField label="Back stake" placeholder="" value={backStake} onChange={setBackStake} prefix="£" tabIndex={1} />
              <InputField label="Back odds" placeholder="" value={backOdds} onChange={setBackOdds} tabIndex={2} />
              {showCommissions ? (
                <InputField label="Back comm." placeholder="" value={backCommission} onChange={setBackCommission} suffix="%" tabIndex={3} />
              ) : null}
            </div>

            <div className="flex rounded-2xl border border-zinc-700 bg-zinc-950 p-1">
              <button
                onClick={() => setBetMode("standard")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${betMode === "standard" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
              >
                Standard
              </button>
              <button
                onClick={() => setBetMode("snr")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${betMode === "snr" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
              >
                SNR
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-300">Number of legs</div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, index) => {
              const count = index + 2;
              return (
                <button
                  key={count}
                  onClick={() => setLegCount(count)}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${legCount === count ? "bg-emerald-400 text-zinc-950" : "border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white"}`}
                >
                  {count}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-rose-400/30 bg-rose-400/10 p-5">
          <div className="mb-4 text-sm font-bold uppercase tracking-wide text-rose-200">Lay legs</div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs leading-5 text-zinc-400">
              Recommended stake is used unless an actual stake is entered. Actual stakes affect the next leg.
            </div>
            <button
              onClick={() => setShowCommissions((current) => !current)}
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${showCommissions ? "bg-emerald-400 text-zinc-950" : "border border-zinc-700 bg-zinc-950 text-zinc-300 hover:text-white"}`}
            >
              {showCommissions ? "Hide commissions" : "Show commissions"}
            </button>
          </div>

          <div className="space-y-4">
            {visibleLayOdds.map((odds, index) => {
              const row = result?.rows?.[index];
              return (
                <div key={index} className={`grid gap-3 ${showCommissions ? "lg:grid-cols-4" : "lg:grid-cols-[1fr_0.85fr_1fr]"}`}>
                  <InputField
                    label={`Leg ${index + 1} lay odds`}
                    placeholder=""
                    value={odds}
                    onChange={(value) => updateLayOdds(index, value)}
                    tabIndex={showCommissions ? index + 4 : index + 3}
                  />
                  {showCommissions ? (
                    <InputField
                      label="Comm."
                      placeholder=""
                      value={commissionValues[index]}
                      onChange={(value) => updateCommission(index, value)}
                      suffix="%"
                      tabIndex={legCount + index + 4}
                    />
                  ) : null}
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-300">Rec. stake</div>
                    <div className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-bold text-emerald-300">
                      {row ? moneyNoSign(row.recommendedStake) : "—"}
                    </div>
                  </div>
                  <InputField
                    label="Actual stake"
                    placeholder="Optional"
                    value={actualStakeValues[index]}
                    onChange={(value) => updateActualStake(index, value)}
                    prefix="£"
                    tabIndex={showCommissions ? legCount * 2 + index + 4 : legCount + index + 3}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={clearInputs}
            className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            Clear inputs
          </button>

          <div className="flex rounded-2xl border border-zinc-700 bg-zinc-950 p-1">
            <button
              onClick={() => setLayMode("even")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${layMode === "even" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
            >
              Even profit
            </button>
            <button
              onClick={() => setLayMode("underlay")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${layMode === "underlay" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
            >
              Underlay
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-7">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-zinc-400">Results</div>
            <div className="mt-1 text-2xl font-bold text-white">Sequential lay plan</div>
          </div>
          <div className="rounded-2xl bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">Live calc</div>
        </div>

        {!result ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-sm leading-7 text-zinc-400">
            Enter back stake, back odds, and lay odds to calculate sequential lay stakes.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultBox label="Total liability if all lose" value={moneyNoSign(result.totalLiability)} />
              <ResultBox label="Best profit" value={money(result.bestProfit)} accent={result.bestProfit >= 0} />
              <ResultBox label="Worst profit" value={money(result.worstProfit)} accent={result.worstProfit >= 0} />
            </div>
            <ResultBox label="If all lay bets lose / back bet wins" value={money(result.profitIfAllLose)} accent={result.profitIfAllLose >= 0} />

            <div className="overflow-hidden rounded-2xl border border-zinc-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Leg</th>
                    <th className="px-4 py-3">Lay odds</th>
                    {showCommissions ? <th className="px-4 py-3">Comm.</th> : null}
                    <th className="px-4 py-3">Stake used</th>
                    <th className="px-4 py-3">Liability</th>
                    <th className="px-4 py-3">Profit if lay wins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 bg-zinc-900/40">
                  {result.rows.map((row) => (
                    <tr key={row.index}>
                      <td className="px-4 py-3 font-semibold text-zinc-100">{row.index}</td>
                      <td className="px-4 py-3 text-zinc-300">{row.layOdds.toFixed(2)}</td>
                      {showCommissions ? <td className="px-4 py-3 text-zinc-300">{(row.commission * 100).toFixed(2)}%</td> : null}
                      <td className="px-4 py-3 text-zinc-300">{moneyNoSign(row.actualStake)}</td>
                      <td className="px-4 py-3 text-zinc-300">{moneyNoSign(row.liability)}</td>
                      <td className={`px-4 py-3 font-semibold ${row.profitIfLayWins >= 0 ? "text-emerald-300" : "text-rose-300"}`}>{money(row.profitIfLayWins)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function MultiLayCalculator() {
  const [bookieStake, setBookieStake] = useState("");
  const [bookieOdds, setBookieOdds] = useState("");
  const [selectionCount, setSelectionCount] = useState(2);
  const [betMode, setBetMode] = useState("standard");
  const [layMode, setLayMode] = useState("even");
  const [layOddsValues, setLayOddsValues] = useState(Array.from({ length: 10 }, () => ""));
  const [commissionValues, setCommissionValues] = useState(Array.from({ length: 10 }, () => ""));
  const [marketCommission, setMarketCommission] = useState("");
  const [commissionMode, setCommissionMode] = useState("individual");
  const [showCommissions, setShowCommissions] = useState(false);

  const visibleLayOdds = layOddsValues.slice(0, selectionCount);
  const visibleCommissions = commissionValues.slice(0, selectionCount);

  const result = useMemo(
    () => calculateMultiLay({
      bookieStake,
      bookieOdds,
      layOddsValues: visibleLayOdds,
      commissionValues: visibleCommissions,
      marketCommission,
      commissionMode,
      betMode,
      layMode,
      showCommissions,
    }),
    [bookieStake, bookieOdds, visibleLayOdds, visibleCommissions, marketCommission, commissionMode, betMode, layMode, showCommissions]
  );

  const updateLayOdds = (index, value) => {
    setLayOddsValues((current) => current.map((item, i) => (i === index ? value : item)));
  };

  const updateCommission = (index, value) => {
    setCommissionValues((current) => current.map((item, i) => (i === index ? value : item)));
  };

  const clearInputs = () => {
    setBookieStake("");
    setBookieOdds("");
    setSelectionCount(2);
    setBetMode("standard");
    setLayMode("even");
    setLayOddsValues(Array.from({ length: 10 }, () => ""));
    setCommissionValues(Array.from({ length: 10 }, () => ""));
    setMarketCommission("");
    setCommissionMode("individual");
    setShowCommissions(false);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <Card className="p-6 sm:p-7">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Multi Lay Calculator</h2>
          <p className="mt-2 text-sm leading-7 text-zinc-400">
            Hedge a bookmaker multi-outcome bet by laying the individual mutually exclusive selections on the exchange.
          </p>
        </div>

        <div className="rounded-3xl border border-sky-400/30 bg-sky-400/10 p-5">
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="grid flex-1 gap-5 sm:grid-cols-2">
              <InputField label="Bookie stake" placeholder="" value={bookieStake} onChange={setBookieStake} prefix="£" tabIndex={1} />
              <InputField label="Bookie odds" placeholder="" value={bookieOdds} onChange={setBookieOdds} tabIndex={2} />
            </div>

            <div className="flex rounded-2xl border border-zinc-700 bg-zinc-950 p-1">
              <button
                onClick={() => setBetMode("standard")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${betMode === "standard" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
              >
                Standard
              </button>
              <button
                onClick={() => setBetMode("snr")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${betMode === "snr" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
              >
                SNR
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-300">Number of lay selections</div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 9 }).map((_, index) => {
              const count = index + 2;
              return (
                <button
                  key={count}
                  onClick={() => setSelectionCount(count)}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${selectionCount === count ? "bg-emerald-400 text-zinc-950" : "border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white"}`}
                >
                  {count}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-rose-400/30 bg-rose-400/10 p-5">
          <div className="mb-4 text-sm font-bold uppercase tracking-wide text-rose-200">Lay selections</div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs leading-5 text-zinc-400">
              Enter the exchange lay odds for each mutually exclusive selection.
            </div>
            <button
              onClick={() => setShowCommissions((current) => !current)}
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${showCommissions ? "bg-emerald-400 text-zinc-950" : "border border-zinc-700 bg-zinc-950 text-zinc-300 hover:text-white"}`}
            >
              {showCommissions ? "Hide commissions" : "Show commissions"}
            </button>
          </div>

          {showCommissions ? (
            <div className="mb-5 rounded-2xl border border-zinc-700 bg-zinc-950/70 p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm font-semibold text-zinc-300">Lay commission</div>
                <div className="flex rounded-2xl border border-zinc-700 bg-zinc-950 p-1">
                  <button
                    onClick={() => setCommissionMode("individual")}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${commissionMode === "individual" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
                  >
                    Individual
                  </button>
                  <button
                    onClick={() => setCommissionMode("market")}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${commissionMode === "market" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
                  >
                    Market
                  </button>
                </div>
              </div>
              {commissionMode === "market" ? (
                <InputField label="Market commission" placeholder="" value={marketCommission} onChange={setMarketCommission} suffix="%" tabIndex={3} />
              ) : (
                <div className="text-xs leading-5 text-zinc-500">Individual mode shows commission boxes beside each lay selection.</div>
              )}
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            {visibleLayOdds.map((odds, index) => (
              <div key={index} className={`grid gap-3 ${showCommissions && commissionMode === "individual" ? "grid-cols-[1fr_0.7fr]" : "grid-cols-1"}`}>
                <InputField
                  label={`Lay selection ${index + 1}`}
                  placeholder=""
                  value={odds}
                  onChange={(value) => updateLayOdds(index, value)}
                  tabIndex={index + 3}
                />
                {showCommissions && commissionMode === "individual" ? (
                  <InputField
                    label="Commission"
                    placeholder=""
                    value={commissionValues[index]}
                    onChange={(value) => updateCommission(index, value)}
                    suffix="%"
                    tabIndex={selectionCount + index + 3}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={clearInputs}
            className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            Clear inputs
          </button>

          <div className="flex rounded-2xl border border-zinc-700 bg-zinc-950 p-1">
            <button
              onClick={() => setLayMode("even")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${layMode === "even" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
            >
              Even profit
            </button>
            <button
              onClick={() => setLayMode("underlay")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${layMode === "underlay" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
            >
              Underlay
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-7">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-zinc-400">Results</div>
            <div className="mt-1 text-2xl font-bold text-white">Multi lay stakes</div>
          </div>
          <div className="rounded-2xl bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">Live calc</div>
        </div>

        {!result ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-sm leading-7 text-zinc-400">
            Enter the bookie stake, bookie odds, and lay odds to calculate the multi-lay stakes.
          </div>
        ) : result.impossible ? (
          <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-6 text-sm leading-7 text-rose-100">
            This setup is not possible with the current odds. One or more lay stakes would need to be negative.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultBox label="Total lay stake" value={moneyNoSign(result.totalLayStake)} />
              <ResultBox label="Best profit" value={money(result.bestProfit)} accent={result.bestProfit >= 0} />
              <ResultBox label="Worst profit" value={money(result.worstProfit)} accent={result.worstProfit >= 0} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ResultBox label="Total liability" value={moneyNoSign(result.totalLiability)} />
              <ResultBox label="If none win" value={money(result.noSelectionProfit)} accent={result.noSelectionProfit >= 0} />
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Selection</th>
                    <th className="px-4 py-3">Lay odds</th>
                    {showCommissions ? <th className="px-4 py-3">Comm.</th> : null}
                    <th className="px-4 py-3">Lay stake</th>
                    <th className="px-4 py-3">Liability</th>
                    <th className="px-4 py-3">Profit if wins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 bg-zinc-900/40">
                  {result.rows.map((row) => (
                    <tr key={row.index}>
                      <td className="px-4 py-3 font-semibold text-zinc-100">{row.index}</td>
                      <td className="px-4 py-3 text-zinc-300">{row.odds.toFixed(2)}</td>
                      {showCommissions ? <td className="px-4 py-3 text-zinc-300">{(row.commission * 100).toFixed(2)}%</td> : null}
                      <td className="px-4 py-3 text-zinc-300">{moneyNoSign(row.layStake)}</td>
                      <td className="px-4 py-3 text-zinc-300">{moneyNoSign(row.liability)}</td>
                      <td className={`px-4 py-3 font-semibold ${row.profit >= 0 ? "text-emerald-300" : "text-rose-300"}`}>{money(row.profit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function DutchingCalculator() {
  const [totalStake, setTotalStake] = useState("");
  const [selectionCount, setSelectionCount] = useState(2);
  const [betMode, setBetMode] = useState("standard");
  const [dutchMode, setDutchMode] = useState("even");
  const [oddsValues, setOddsValues] = useState(Array.from({ length: 10 }, () => ""));
  const [commissionValues, setCommissionValues] = useState(Array.from({ length: 10 }, () => ""));
  const [showCommissions, setShowCommissions] = useState(false);

  const visibleOdds = oddsValues.slice(0, selectionCount);
  const visibleCommissions = commissionValues.slice(0, selectionCount);

  const result = useMemo(
    () => calculateDutching({
      baseStake: totalStake,
      oddsValues: visibleOdds,
      commissionValues: visibleCommissions,
      betMode,
      dutchMode,
      showCommissions,
    }),
    [totalStake, visibleOdds, visibleCommissions, betMode, dutchMode, showCommissions]
  );

  const updateOdds = (index, value) => {
    setOddsValues((current) => current.map((item, i) => (i === index ? value : item)));
  };

  const updateCommission = (index, value) => {
    setCommissionValues((current) => current.map((item, i) => (i === index ? value : item)));
  };

  const clearInputs = () => {
    setTotalStake("");
    setSelectionCount(2);
    setBetMode("standard");
    setDutchMode("even");
    setOddsValues(Array.from({ length: 10 }, () => ""));
    setCommissionValues(Array.from({ length: 10 }, () => ""));
    setShowCommissions(false);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <Card className="p-6 sm:p-7">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Dutching Calculator</h2>
          <p className="mt-2 text-sm leading-7 text-zinc-400">
            Split a total stake across multiple outcomes. Use even profit mode for equal returns, or underlay mode to put all profit on selection 1 while the other selections break even.
          </p>
        </div>

        <div className="rounded-3xl border border-sky-400/30 bg-sky-400/10 p-5">
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="grid flex-1 gap-5 sm:grid-cols-1">
              <InputField label="Stake (Selection 1)" placeholder="" value={totalStake} onChange={setTotalStake} prefix="£" tabIndex={1} />
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex rounded-2xl border border-zinc-700 bg-zinc-950 p-1">
                <button
                  onClick={() => setBetMode("standard")}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${betMode === "standard" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setBetMode("snr")}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${betMode === "snr" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
                >
                  SNR
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-300">Number of selections</div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 9 }).map((_, index) => {
              const count = index + 2;
              return (
                <button
                  key={count}
                  onClick={() => setSelectionCount(count)}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${selectionCount === count ? "bg-emerald-400 text-zinc-950" : "border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white"}`}
                >
                  {count}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-rose-400/30 bg-rose-400/10 p-5">
          <div className="mb-4 text-sm font-bold uppercase tracking-wide text-rose-200">Selection odds</div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs leading-5 text-zinc-400">
              {betMode === "snr" ? "Selection 1 is treated as the free bet. The rest are normal real-money stakes." : "Selection 1 stake is fixed. Other stakes are calculated around it."}
            </div>
            <button
              onClick={() => setShowCommissions((current) => !current)}
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${showCommissions ? "bg-emerald-400 text-zinc-950" : "border border-zinc-700 bg-zinc-950 text-zinc-300 hover:text-white"}`}
            >
              {showCommissions ? "Hide commissions" : "Show commissions"}
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {visibleOdds.map((odds, index) => (
              <div key={index} className={`grid gap-3 ${showCommissions && commissionMode === "individual" ? "grid-cols-[1fr_0.7fr]" : "grid-cols-1"}`}>
                <InputField
                  label={`Selection ${index + 1}${index === 0 && dutchMode === "underlay" ? " (profit leg)" : ""}${index === 0 && betMode === "snr" ? " (free bet)" : ""}`}
                  placeholder=""
                  value={odds}
                  onChange={(value) => updateOdds(index, value)}
                  tabIndex={index + 2}
                />
                {showCommissions ? (
                  <InputField
                    label="Commission"
                    placeholder=""
                    value={commissionValues[index]}
                    onChange={(value) => updateCommission(index, value)}
                    suffix="%"
                    tabIndex={selectionCount + index + 2}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={clearInputs}
            className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            Clear inputs
          </button>

          <div className="flex rounded-2xl border border-zinc-700 bg-zinc-950 p-1">
            <button
              onClick={() => setDutchMode("even")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${dutchMode === "even" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
            >
              Even profit
            </button>
            <button
              onClick={() => setDutchMode("underlay")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${dutchMode === "underlay" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
            >
              Underlay
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-7">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-zinc-400">Results</div>
            <div className="mt-1 text-2xl font-bold text-white">Dutching stakes</div>
          </div>
          <div className="rounded-2xl bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">Live calc</div>
        </div>

        {!result ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-sm leading-7 text-zinc-400">
            Enter the stake for selection 1 and odds to calculate dutching stakes.
          </div>
        ) : result.impossible ? (
          <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-6 text-sm leading-7 text-rose-100">
            Underlay is not possible with these odds. The break-even selections would require an infinite or negative total outlay.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultBox label={betMode === "snr" ? "Real stake" : "Total staked"} value={moneyNoSign(result.totalStaked)} />
              <ResultBox label="Best profit" value={money(result.bestProfit)} accent={result.bestProfit >= 0} />
              <ResultBox label="Worst profit" value={money(result.worstProfit)} accent={result.worstProfit >= 0} />
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Selection</th>
                    <th className="px-4 py-3">Odds</th>
                    {showCommissions ? <th className="px-4 py-3">Comm.</th> : null}
                    <th className="px-4 py-3">Stake</th>
                    <th className="px-4 py-3">Return</th>
                    <th className="px-4 py-3">Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 bg-zinc-900/40">
                  {result.rows.map((row) => (
                    <tr key={row.index} className={row.index === 1 && dutchMode === "underlay" ? "bg-emerald-400/5" : ""}>
                      <td className="px-4 py-3 font-semibold text-zinc-100">
                        {row.index}{row.index === 1 && dutchMode === "underlay" ? " · profit leg" : ""}
                      </td>
                      <td className="px-4 py-3 text-zinc-300">{row.odds.toFixed(2)}</td>
                      {showCommissions ? <td className="px-4 py-3 text-zinc-300">{(row.commission * 100).toFixed(2)}%</td> : null}
                      <td className="px-4 py-3 text-zinc-300">{moneyNoSign(row.stake)}</td>
                      <td className="px-4 py-3 text-zinc-300">{moneyNoSign(row.returnValue)}</td>
                      <td className={`px-4 py-3 font-semibold ${row.profit >= 0 ? "text-emerald-300" : "text-rose-300"}`}>{money(row.profit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function MatchedCalculator({ type }) {
  const [backStake, setBackStake] = useState("");
  const [backOdds, setBackOdds] = useState("");
  const [layOdds, setLayOdds] = useState("");
  const [backCommission, setBackCommission] = useState("");
  const [layCommission, setLayCommission] = useState("");
  const [manualLayStake, setManualLayStake] = useState("");
  const [standardMode, setStandardMode] = useState("standard");

  const result = useMemo(() => {
    const payload = { backStake, backOdds, layOdds, backCommission, layCommission, manualLayStake };
    if (type === "snr") return calculateFreeBetSNR(payload);
    return calculateStandard(payload);
  }, [type, backStake, backOdds, layOdds, backCommission, layCommission, manualLayStake]);

  const clearInputs = () => {
    setBackStake("");
    setBackOdds("");
    setLayOdds("");
    setBackCommission("");
    setLayCommission("");
    setManualLayStake("");
  };

  const title = type === "snr" ? "Free Bet SNR" : "Standard Calculator";
  const subtitle =
    type === "snr"
      ? "Calculate the lay stake, liability, and expected profit for a stake-not-returned free bet. Optional manual lay stake lets you test an underlay."
      : "Calculate the lay stake, liability, and qualifying loss for a standard matched bet.";

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <Card className="p-6 sm:p-7">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-7 text-zinc-400">{subtitle}</p>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-sky-400/30 bg-sky-400/10 p-5">
            <div className="mb-4 text-sm font-bold uppercase tracking-wide text-sky-200">Back bet</div>
            <div className="grid gap-5 md:grid-cols-3">
              <InputField label="Back stake" placeholder="" value={backStake} onChange={setBackStake} prefix="£" tabIndex={1} />
              <InputField label="Back odds" placeholder="" value={backOdds} onChange={setBackOdds} tabIndex={2} />
              <InputField label="Bookie commission" placeholder="" value={backCommission} onChange={setBackCommission} suffix="%" tabIndex={4} />
            </div>
          </div>

          <div className="rounded-3xl border border-rose-400/30 bg-rose-400/10 p-5">
            <div className="mb-4 text-sm font-bold uppercase tracking-wide text-rose-200">Lay bet</div>
            <div className="grid gap-5 md:grid-cols-3">
              <div className="hidden md:block" />
              <InputField label="Lay odds" placeholder="" value={layOdds} onChange={setLayOdds} tabIndex={3} />
              <div>
                <InputField label="Lay commission" placeholder="" value={layCommission} onChange={setLayCommission} suffix="%" tabIndex={5} />
                {type === "snr" ? (
                  <div className="mt-5">
                    <InputField label="Manual lay stake" placeholder="Optional" value={manualLayStake} onChange={setManualLayStake} prefix="£" tabIndex={6} />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={clearInputs}
            className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            Clear inputs
          </button>

          {type === "standard" ? (
            <div className="flex rounded-2xl border border-zinc-700 bg-zinc-950 p-1">
              <button
                onClick={() => setStandardMode("standard")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${standardMode === "standard" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
              >
                Standard
              </button>
              <button
                onClick={() => setStandardMode("underlay")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${standardMode === "underlay" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-white"}`}
              >
                Underlay
              </button>
            </div>
          ) : null}
        </div>
      </Card>

      <Card className="p-6 sm:p-7">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-zinc-400">Results</div>
            <div className="mt-1 text-2xl font-bold text-white">Lay calculation</div>
          </div>
          <div className="rounded-2xl bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">Live calc</div>
        </div>
        <CalculatorResults result={result} type={type} standardMode={standardMode} />
      </Card>
    </div>
  );
}

function PricingShell({ title, subtitle, children, result }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <Card className="p-6 sm:p-7">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-zinc-400">{subtitle}</p>
        <div className="mt-7">{children}</div>
      </Card>
      <Card className="p-6 sm:p-7">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-zinc-400">Results</div>
            <div className="mt-1 text-2xl font-bold text-white">Model output</div>
          </div>
          <div className="rounded-2xl bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">Live calc</div>
        </div>
        {result}
      </Card>
    </div>
  );
}

function PricingToolsPlaceholder() {
  const [active, setActive] = useState("team-first");

  const [teamFirst, setTeamFirst] = useState({ home: "", draw: "", away: "", nilNil: "", bookieHome: "", bookieAway: "", bookieNoGoal: "" });
  const [oneHBtts, setOneHBtts] = useState({ over05: "", over15: "", over25: "", htHome: "", htDraw: "", htAway: "", bookie: "" });
  const [score1H, setScore1H] = useState({ team: "home", over05: "", htHome: "", htDraw: "", htAway: "", bookie: "" });
  const [scoreBothHalves, setScoreBothHalves] = useState({ team: "home", htOver05: "", htHome: "", htDraw: "", htAway: "", ftOver25: "", ftHome: "", ftDraw: "", ftAway: "", bookie: "" });
  const [xyz, setXyz] = useState({ odds1: "", odds2: "", odds3: "", odds4: "", odds5: "", bookie: "" });

  const factorial = (n) => {
    if (n <= 1) return 1;
    let f = 1;
    for (let i = 2; i <= n; i += 1) f *= i;
    return f;
  };

  const poisson = (k, lambda) => Math.exp(-lambda) * Math.pow(lambda, k) / factorial(k);

  const poissonCdf = (k, lambda) => {
    let total = 0;
    for (let i = 0; i <= k; i += 1) total += poisson(i, lambda);
    return total;
  };

  const matchProbs = (muH, muA) => {
    let pHome = 0;
    let pDraw = 0;
    let pAway = 0;
    for (let h = 0; h <= 10; h += 1) {
      for (let a = 0; a <= 10; a += 1) {
        const p = poisson(h, muH) * poisson(a, muA);
        if (h > a) pHome += p;
        else if (h === a) pDraw += p;
        else pAway += p;
      }
    }
    return { pHome, pDraw, pAway };
  };

  const fitSplit = (totalXg, homeOdds, drawOdds, awayOdds) => {
    const h = 1 / homeOdds;
    const d = 1 / drawOdds;
    const a = 1 / awayOdds;
    const sum = h + d + a;
    const targets = { pHome: h / sum, pDraw: d / sum, pAway: a / sum };
    let best = { error: Infinity, muHome: totalXg / 2, muAway: totalXg / 2 };
    for (let muH = 0.01; muH <= totalXg - 0.01; muH += 0.01) {
      const muA = totalXg - muH;
      const model = matchProbs(muH, muA);
      const error = Math.pow(model.pHome - targets.pHome, 2) + Math.pow(model.pDraw - targets.pDraw, 2) + Math.pow(model.pAway - targets.pAway, 2);
      if (error < best.error) best = { error, muHome: muH, muAway: muA };
    }
    return best;
  };

  const fitTotalFromOvers = (over05, over15, over25) => {
    const t05 = Math.min(0.999, Math.max(0.001, 1 / over05));
    const t15 = Math.min(0.999, Math.max(0.001, 1 / over15));
    const t25 = Math.min(0.999, Math.max(0.001, 1 / over25));
    let best = { error: Infinity, lambda: 1.2 };
    for (let lambda = 0.05; lambda <= 4.5; lambda += 0.005) {
      const m05 = 1 - poisson(0, lambda);
      const m15 = 1 - poissonCdf(1, lambda);
      const m25 = 1 - poissonCdf(2, lambda);
      const error = Math.pow(m05 - t05, 2) + Math.pow(m15 - t15, 2) + Math.pow(m25 - t25, 2);
      if (error < best.error) best = { error, lambda };
    }
    return best.lambda;
  };

  const fitTotalFromOver25 = (over25) => {
    const target = Math.min(0.999, Math.max(0.001, 1 / over25));
    let best = { error: Infinity, lambda: 2.5 };
    for (let lambda = 0.05; lambda <= 6.5; lambda += 0.005) {
      const model = 1 - poissonCdf(2, lambda);
      const error = Math.pow(model - target, 2);
      if (error < best.error) best = { error, lambda };
    }
    return best.lambda;
  };

  const evText = (bookie, fair) => {
    const b = numberOrNull(bookie);
    if (!b || !fair) return "—";
    const ev = (b / fair - 1) * 100;
    return `${ev >= 0 ? "+" : ""}${ev.toFixed(1)}%`;
  };

  const teamFirstResult = useMemo(() => {
    const home = numberOrNull(teamFirst.home);
    const draw = numberOrNull(teamFirst.draw);
    const away = numberOrNull(teamFirst.away);
    const nilNil = numberOrNull(teamFirst.nilNil);
    if (!home || !draw || !away || !nilNil) return null;
    const total = -Math.log(1 / nilNil);
    const split = fitSplit(total, home, draw, away);
    const anyGoal = 1 - Math.exp(-(split.muHome + split.muAway));
    const homeProb = (split.muHome / (split.muHome + split.muAway)) * anyGoal;
    const awayProb = (split.muAway / (split.muHome + split.muAway)) * anyGoal;
    const noGoalProb = Math.exp(-(split.muHome + split.muAway));
    return { split, homeProb, awayProb, noGoalProb };
  }, [teamFirst]);

  const oneHBttsResult = useMemo(() => {
    const o05 = numberOrNull(oneHBtts.over05);
    const o15 = numberOrNull(oneHBtts.over15);
    const o25 = numberOrNull(oneHBtts.over25);
    const h = numberOrNull(oneHBtts.htHome);
    const d = numberOrNull(oneHBtts.htDraw);
    const a = numberOrNull(oneHBtts.htAway);
    if (!o05 || !o15 || !o25 || !h || !d || !a) return null;
    const total = fitTotalFromOvers(o05, o15, o25);
    const split = fitSplit(total, h, d, a);
    const prob = (1 - Math.exp(-split.muHome)) * (1 - Math.exp(-split.muAway));
    return { total, split, prob, fair: 1 / prob };
  }, [oneHBtts]);

  const score1HResult = useMemo(() => {
    const o05 = numberOrNull(score1H.over05);
    const h = numberOrNull(score1H.htHome);
    const d = numberOrNull(score1H.htDraw);
    const a = numberOrNull(score1H.htAway);
    if (!o05 || !h || !d || !a) return null;
    const total = -Math.log(Math.max(0.001, 1 - Math.min(0.999, 1 / o05)));
    const split = fitSplit(total, h, d, a);
    const teamXg = score1H.team === "home" ? split.muHome : split.muAway;
    const prob = 1 - Math.exp(-teamXg);
    return { total, split, teamXg, prob, fair: 1 / prob };
  }, [score1H]);

  const bothHalvesResult = useMemo(() => {
    const htO05 = numberOrNull(scoreBothHalves.htOver05);
    const hth = numberOrNull(scoreBothHalves.htHome);
    const htd = numberOrNull(scoreBothHalves.htDraw);
    const hta = numberOrNull(scoreBothHalves.htAway);
    const ftO25 = numberOrNull(scoreBothHalves.ftOver25);
    const fth = numberOrNull(scoreBothHalves.ftHome);
    const ftd = numberOrNull(scoreBothHalves.ftDraw);
    const fta = numberOrNull(scoreBothHalves.ftAway);
    if (!htO05 || !hth || !htd || !hta || !ftO25 || !fth || !ftd || !fta) return null;
    const total1H = -Math.log(Math.max(0.001, 1 - Math.min(0.999, 1 / htO05)));
    const htSplit = fitSplit(total1H, hth, htd, hta);
    const totalFt = fitTotalFromOver25(ftO25);
    const total2H = Math.max(0.05, totalFt - total1H);
    const inv = 1 / fth + 1 / ftd + 1 / fta;
    const pHome = (1 / fth) / inv;
    const pAway = (1 / fta) / inv;
    const share = pHome + pAway > 0 ? pHome / (pHome + pAway) : 0.5;
    const team1H = scoreBothHalves.team === "home" ? htSplit.muHome : htSplit.muAway;
    const team2H = scoreBothHalves.team === "home" ? total2H * share : total2H * (1 - share);
    const prob = (1 - Math.exp(-team1H)) * (1 - Math.exp(-team2H));
    return { total1H, totalFt, total2H, team1H, team2H, prob, fair: 1 / prob };
  }, [scoreBothHalves]);

  const xyzResult = useMemo(() => {
    const odds = [xyz.odds1, xyz.odds2, xyz.odds3, xyz.odds4, xyz.odds5].map(numberOrNull).filter(Boolean);
    if (!odds.length) return null;
    const prob = odds.reduce((sum, oddsValue) => sum + 1 / oddsValue, 0);
    return { prob, fair: 1 / prob, odds };
  }, [xyz]);

  const clearPricing = (key) => {
    if (key === "team-first") setTeamFirst({ home: "", draw: "", away: "", nilNil: "", bookieHome: "", bookieAway: "", bookieNoGoal: "" });
    if (key === "1h-btts") setOneHBtts({ over05: "", over15: "", over25: "", htHome: "", htDraw: "", htAway: "", bookie: "" });
    if (key === "score-1h") setScore1H({ team: "home", over05: "", htHome: "", htDraw: "", htAway: "", bookie: "" });
    if (key === "both-halves") setScoreBothHalves({ team: "home", htOver05: "", htHome: "", htDraw: "", htAway: "", ftOver25: "", ftHome: "", ftDraw: "", ftAway: "", bookie: "" });
    if (key === "xyz") setXyz({ odds1: "", odds2: "", odds3: "", odds4: "", odds5: "", bookie: "" });
  };


  return (
    <>
      <div className="border-b border-zinc-800 bg-zinc-950/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-emerald-300">Pricing tools</div>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Football Pricing Tools</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-400">Fair-odds calculators for boosted and illiquid football markets.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ["team-first", "Team First"],
              ["1h-btts", "1H BTTS"],
              ["score-1h", "Score 1H"],
              ["both-halves", "Both Halves"],
              ["xyz", "X/Y/Z"],
            ].map(([key, label]) => (
              <button key={key} onClick={() => setActive(key)} className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${active === key ? "bg-emerald-400 text-zinc-950" : "border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-white"}`}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className={active === "team-first" ? "block" : "hidden"}>
          <PricingShell
            title="Team To Score First"
            subtitle="Use FT 1X2 and 0-0 odds to price home first, away first, and no goal."
            result={teamFirstResult ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <ResultBox label="Home first" value={(1 / teamFirstResult.homeProb).toFixed(2)} accent />
                  <ResultBox label="Away first" value={(1 / teamFirstResult.awayProb).toFixed(2)} />
                  <ResultBox label="No goal" value={(1 / teamFirstResult.noGoalProb).toFixed(2)} />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <ResultBox label="Home EV" value={evText(teamFirst.bookieHome, 1 / teamFirstResult.homeProb)} accent />
                  <ResultBox label="Away EV" value={evText(teamFirst.bookieAway, 1 / teamFirstResult.awayProb)} />
                  <ResultBox label="No Goal EV" value={evText(teamFirst.bookieNoGoal, 1 / teamFirstResult.noGoalProb)} />
                </div>
              </div>
            ) : <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-sm text-zinc-400">Enter prices to calculate fair odds.</div>}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <InputField label="Home odds" value={teamFirst.home} onChange={(v) => setTeamFirst((s) => ({ ...s, home: v }))} />
              <InputField label="Draw odds" value={teamFirst.draw} onChange={(v) => setTeamFirst((s) => ({ ...s, draw: v }))} />
              <InputField label="Away odds" value={teamFirst.away} onChange={(v) => setTeamFirst((s) => ({ ...s, away: v }))} />
              <InputField label="0-0 odds" value={teamFirst.nilNil} onChange={(v) => setTeamFirst((s) => ({ ...s, nilNil: v }))} />
            </div>
            <div className="my-7 h-px bg-zinc-800" />
            <div className="grid gap-5 sm:grid-cols-3">
              <InputField label="Bookie home first" value={teamFirst.bookieHome} onChange={(v) => setTeamFirst((s) => ({ ...s, bookieHome: v }))} />
              <InputField label="Bookie away first" value={teamFirst.bookieAway} onChange={(v) => setTeamFirst((s) => ({ ...s, bookieAway: v }))} />
              <InputField label="Bookie no goal" value={teamFirst.bookieNoGoal} onChange={(v) => setTeamFirst((s) => ({ ...s, bookieNoGoal: v }))} />
            </div>
            <button onClick={() => clearPricing("team-first")} className="mt-7 rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200">Clear inputs</button>
          </PricingShell>
        </div>

        <div className={active === "1h-btts" ? "block" : "hidden"}>
          <PricingShell
            title="1st Half BTTS"
            subtitle="Use first-half goal lines and HT 1X2 to price 1H BTTS."
            result={oneHBttsResult ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultBox label="Fair odds" value={oneHBttsResult.fair.toFixed(2)} accent />
                <ResultBox label="Probability" value={`${(oneHBttsResult.prob * 100).toFixed(2)}%`} />
                <ResultBox label="EV" value={evText(oneHBtts.bookie, oneHBttsResult.fair)} accent />
                <ResultBox label="1H total xG" value={oneHBttsResult.total.toFixed(3)} />
              </div>
            ) : <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-sm text-zinc-400">Enter prices to calculate fair odds.</div>}
          >
            <div className="grid gap-5 sm:grid-cols-3">
              <InputField label="1H Over 0.5" value={oneHBtts.over05} onChange={(v) => setOneHBtts((s) => ({ ...s, over05: v }))} />
              <InputField label="1H Over 1.5" value={oneHBtts.over15} onChange={(v) => setOneHBtts((s) => ({ ...s, over15: v }))} />
              <InputField label="1H Over 2.5" value={oneHBtts.over25} onChange={(v) => setOneHBtts((s) => ({ ...s, over25: v }))} />
              <InputField label="HT Home" value={oneHBtts.htHome} onChange={(v) => setOneHBtts((s) => ({ ...s, htHome: v }))} />
              <InputField label="HT Draw" value={oneHBtts.htDraw} onChange={(v) => setOneHBtts((s) => ({ ...s, htDraw: v }))} />
              <InputField label="HT Away" value={oneHBtts.htAway} onChange={(v) => setOneHBtts((s) => ({ ...s, htAway: v }))} />
            </div>
            <div className="mt-5 max-w-sm"><InputField label="Bookie odds" value={oneHBtts.bookie} onChange={(v) => setOneHBtts((s) => ({ ...s, bookie: v }))} /></div>
            <button onClick={() => clearPricing("1h-btts")} className="mt-7 rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200">Clear inputs</button>
          </PricingShell>
        </div>

        <div className={active === "score-1h" ? "block" : "hidden"}>
          <PricingShell
            title="Team To Score In The First Half"
            subtitle="Use HT Over 0.5 and HT 1X2 to price home or away to score in the first half."
            result={score1HResult ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultBox label="Fair odds" value={score1HResult.fair.toFixed(2)} accent />
                <ResultBox label="Probability" value={`${(score1HResult.prob * 100).toFixed(2)}%`} />
                <ResultBox label="EV" value={evText(score1H.bookie, score1HResult.fair)} accent />
                <ResultBox label="Team 1H xG" value={score1HResult.teamXg.toFixed(3)} />
              </div>
            ) : <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-sm text-zinc-400">Enter prices to calculate fair odds.</div>}
          >
            <div className="mb-5 flex gap-2">
              <button onClick={() => setScore1H((s) => ({ ...s, team: "home" }))} className={`rounded-2xl px-4 py-2 text-sm font-semibold ${score1H.team === "home" ? "bg-emerald-400 text-zinc-950" : "border border-zinc-700 text-zinc-300"}`}>Home</button>
              <button onClick={() => setScore1H((s) => ({ ...s, team: "away" }))} className={`rounded-2xl px-4 py-2 text-sm font-semibold ${score1H.team === "away" ? "bg-emerald-400 text-zinc-950" : "border border-zinc-700 text-zinc-300"}`}>Away</button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <InputField label="HT Over 0.5" value={score1H.over05} onChange={(v) => setScore1H((s) => ({ ...s, over05: v }))} />
              <InputField label="Bookie odds" value={score1H.bookie} onChange={(v) => setScore1H((s) => ({ ...s, bookie: v }))} />
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <InputField label="HT Home" value={score1H.htHome} onChange={(v) => setScore1H((s) => ({ ...s, htHome: v }))} />
              <InputField label="HT Draw" value={score1H.htDraw} onChange={(v) => setScore1H((s) => ({ ...s, htDraw: v }))} />
              <InputField label="HT Away" value={score1H.htAway} onChange={(v) => setScore1H((s) => ({ ...s, htAway: v }))} />
            </div>
            <button onClick={() => clearPricing("score-1h")} className="mt-7 rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200">Clear inputs</button>
          </PricingShell>
        </div>

        <div className={active === "both-halves" ? "block" : "hidden"}>
          <PricingShell
            title="Team To Score In Both Halves"
            subtitle="Use HT/FT markets to estimate a team scoring in both halves."
            result={bothHalvesResult ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultBox label="Fair odds" value={bothHalvesResult.fair.toFixed(2)} accent />
                <ResultBox label="Probability" value={`${(bothHalvesResult.prob * 100).toFixed(2)}%`} />
                <ResultBox label="EV" value={evText(scoreBothHalves.bookie, bothHalvesResult.fair)} accent />
                <ResultBox label="Team 1H / 2H xG" value={`${bothHalvesResult.team1H.toFixed(2)} / ${bothHalvesResult.team2H.toFixed(2)}`} />
              </div>
            ) : <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-sm text-zinc-400">Enter prices to calculate fair odds.</div>}
          >
            <div className="mb-5 flex gap-2">
              <button onClick={() => setScoreBothHalves((s) => ({ ...s, team: "home" }))} className={`rounded-2xl px-4 py-2 text-sm font-semibold ${scoreBothHalves.team === "home" ? "bg-emerald-400 text-zinc-950" : "border border-zinc-700 text-zinc-300"}`}>Home</button>
              <button onClick={() => setScoreBothHalves((s) => ({ ...s, team: "away" }))} className={`rounded-2xl px-4 py-2 text-sm font-semibold ${scoreBothHalves.team === "away" ? "bg-emerald-400 text-zinc-950" : "border border-zinc-700 text-zinc-300"}`}>Away</button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <InputField label="HT Over 0.5" value={scoreBothHalves.htOver05} onChange={(v) => setScoreBothHalves((s) => ({ ...s, htOver05: v }))} />
              <InputField label="FT Over 2.5" value={scoreBothHalves.ftOver25} onChange={(v) => setScoreBothHalves((s) => ({ ...s, ftOver25: v }))} />
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <InputField label="HT Home" value={scoreBothHalves.htHome} onChange={(v) => setScoreBothHalves((s) => ({ ...s, htHome: v }))} />
              <InputField label="HT Draw" value={scoreBothHalves.htDraw} onChange={(v) => setScoreBothHalves((s) => ({ ...s, htDraw: v }))} />
              <InputField label="HT Away" value={scoreBothHalves.htAway} onChange={(v) => setScoreBothHalves((s) => ({ ...s, htAway: v }))} />
              <InputField label="FT Home" value={scoreBothHalves.ftHome} onChange={(v) => setScoreBothHalves((s) => ({ ...s, ftHome: v }))} />
              <InputField label="FT Draw" value={scoreBothHalves.ftDraw} onChange={(v) => setScoreBothHalves((s) => ({ ...s, ftDraw: v }))} />
              <InputField label="FT Away" value={scoreBothHalves.ftAway} onChange={(v) => setScoreBothHalves((s) => ({ ...s, ftAway: v }))} />
            </div>
            <div className="mt-5 max-w-sm"><InputField label="Bookie odds" value={scoreBothHalves.bookie} onChange={(v) => setScoreBothHalves((s) => ({ ...s, bookie: v }))} /></div>
            <button onClick={() => clearPricing("both-halves")} className="mt-7 rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200">Clear inputs</button>
          </PricingShell>
        </div>

        <div className={active === "xyz" ? "block" : "hidden"}>
          <PricingShell
            title="X or Y or Z Calculator"
            subtitle="Combine mutually exclusive selections into one fair price."
            result={xyzResult ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultBox label="Combined odds" value={xyzResult.fair.toFixed(2)} accent />
                <ResultBox label="Combined probability" value={`${(xyzResult.prob * 100).toFixed(2)}%`} />
                <ResultBox label="EV" value={evText(xyz.bookie, xyzResult.fair)} accent />
                <ResultBox label="Selections used" value={String(xyzResult.odds.length)} />
              </div>
            ) : <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-sm text-zinc-400">Enter one or more odds to calculate the combined price.</div>}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <InputField key={n} label={`Selection ${n} odds`} value={xyz[`odds${n}`]} onChange={(v) => setXyz((s) => ({ ...s, [`odds${n}`]: v }))} />
              ))}
              <InputField label="Bookie odds" value={xyz.bookie} onChange={(v) => setXyz((s) => ({ ...s, bookie: v }))} />
            </div>
            <button onClick={() => clearPricing("xyz")} className="mt-7 rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200">Clear inputs</button>
          </PricingShell>
        </div>
      </main>
    </>
  );
}

function MatchedBettingSection() {
  const [active, setActive] = useState("standard");

  return (
    <>
      <div className="border-b border-zinc-800 bg-zinc-950/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-emerald-300">Matched betting tools</div>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Matched Betting Calculators</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-400">
              Standard lays, free bets, dutching, sequential lays, multi-lays, and advanced multi-back/multi-lay hedges.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              ["standard", "Standard"],
              ["snr", "SNR"],
              ["dutching", "Dutching"],
              ["multi-lay", "Multi Lay"],
              ["sequential-lay", "Sequential Lay"],
              ["multi-back-lay", "Multi Back Lay"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${active === key ? "bg-emerald-400 text-zinc-950" : "border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-white"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className={active === "standard" ? "block" : "hidden"}>
          <MatchedCalculator type="standard" />
        </div>
        <div className={active === "snr" ? "block" : "hidden"}>
          <MatchedCalculator type="snr" />
        </div>
        <div className={active === "dutching" ? "block" : "hidden"}>
          <DutchingCalculator />
        </div>
        <div className={active === "multi-lay" ? "block" : "hidden"}>
          <MultiLayCalculator />
        </div>
        <div className={active === "sequential-lay" ? "block" : "hidden"}>
          <SequentialLayCalculator />
        </div>
        <div className={active === "multi-back-lay" ? "block" : "hidden"}>
          <MultiBackLayCalculator />
        </div>
      </main>
    </>
  );
}

export default function BoostCheckerToolsDemo() {
  const [section, setSection] = useState("matched");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <button onClick={() => setSection("pricing")} className="text-left">
            <div className="text-sm font-semibold uppercase tracking-wide text-emerald-300">BoostChecker</div>
            <div className="mt-1 text-2xl font-black tracking-tight text-white">Betting Calculators</div>
            <div className="mt-1 text-xs text-zinc-500">Fair odds and matched betting tools in separate sections</div>
          </button>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSection("pricing")}
              className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${section === "pricing" ? "bg-emerald-400 text-zinc-950" : "border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-white"}`}
            >
              Pricing Tools
            </button>
            <button
              onClick={() => setSection("matched")}
              className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${section === "matched" ? "bg-emerald-400 text-zinc-950" : "border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-white"}`}
            >
              Matched Betting
            </button>
          </div>
        </div>
      </header>

      {section === "pricing" ? <PricingToolsPlaceholder /> : <MatchedBettingSection />}
    </div>
  );
}
