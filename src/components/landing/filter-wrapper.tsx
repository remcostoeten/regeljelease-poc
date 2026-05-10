function CheckIcon() {
  return (
    <svg
      className="h-6 w-6 text-brand-accent"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12.5L9.2 16.7L19 6.9"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const fields = [
  {
    label: "Merk",
    value: (
      <>
        Voeg een merk toe
        <span className="ml-2 inline-flex items-center gap-2 rounded-full bg-brand-field-selected px-2 py-1 text-sm">
          Ford <span aria-hidden="true">×</span>
        </span>
      </>
    ),
  },
  { label: "Model", value: "Kies de modellen" },
  { label: "Budget tot", value: "tot..." },
  { label: "Trefwoord", value: "Bijv. GTI of L2H2" },
];

export function FilterWrapper() {
  return (
    <section className="mx-auto w-full max-w-page px-5 sm:px-8">
      <div className="rounded-card bg-brand-surface px-6 py-7 shadow-brand-card sm:px-10">
        <div className="grid gap-4 md:grid-cols-4">
          {fields.map((field) => (
            <label key={field.label} className="block">
              <span className="mb-2 block text-sm font-medium text-brand-ink">
                {field.label}
              </span>
              <span className="flex h-filter-field items-center justify-between rounded-field bg-brand-field px-4 text-sm text-brand-ink">
                <span className="truncate">{field.value}</span>
                {field.label !== "Trefwoord" ? <ChevronDownIcon /> : null}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-brand-ink">
            {["+30.000 voertuigen", "Binnen een dag geregeld", "Zonder jaarcijfers"].map(
              (item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckIcon />
                  {item}
                </li>
              ),
            )}
          </ul>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button className="text-sm font-medium text-brand-muted underline underline-offset-2">
              + Meer filters
            </button>
            <button className="h-14 rounded-field bg-brand-ink px-7 text-base font-semibold text-white">
              Aanbod bekijken (20.334)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
