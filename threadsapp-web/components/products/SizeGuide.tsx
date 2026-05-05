"use client";

import { useState } from "react";

export function SizeGuide() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="text-sm font-semibold text-primary">
        Size Guide
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-secondary/40 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg rounded-[32px] bg-white p-6" onClick={(event) => event.stopPropagation()}>
            <h3 className="text-xl font-semibold text-secondary">Size Guide</h3>
            <div className="mt-4 overflow-hidden rounded-3xl border border-secondary/10">
              <table className="w-full text-sm">
                <thead className="bg-background text-left">
                  <tr>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">Chest</th>
                    <th className="px-4 py-3">Waist</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["S", "36", "30"],
                    ["M", "38", "32"],
                    ["L", "40", "34"],
                    ["XL", "42", "36"]
                  ].map((row) => (
                    <tr key={row[0]} className="border-t border-secondary/10">
                      {row.map((cell) => (
                        <td key={cell} className="px-4 py-3">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
