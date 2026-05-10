"use client";

import { Component, ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error("[ErrorBoundary caught error]", error);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      
      return (
        <div className="flex flex-col items-center justify-center rounded-card bg-red-50 p-6 border border-red-200">
          <h2 className="text-red-800 font-semibold mb-2">Filters konden niet geladen worden</h2>
          <p className="text-red-600 text-sm mb-4">
            {this.state.error?.message || "Er is een onbekende fout opgetreden."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="text-sm px-4 py-2 bg-red-100 text-red-800 rounded-field hover:bg-red-200 transition"
          >
            Opnieuw proberen
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
