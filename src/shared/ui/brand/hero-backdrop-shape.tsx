type Props = {
    className?: string;
};

export function HeroBackdropShape({ className = "hero-background-shape" }: Props) {
    return (
        <svg
            className={className}
            viewBox="0 0 1281 600"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <path
                d="M0 0V399.177C0 545.248 151.096 642.343 283.812 581.605L1281 125V0H1004H0Z"
                fill="url(#hero-gradient)"
            />
            <defs>
                <linearGradient
                    id="hero-gradient"
                    x1="-298.233"
                    y1="975.319"
                    x2="1096.75"
                    y2="340.541"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0.42" stopColor="#EA7520" />
                    <stop offset="1" stopColor="#E7371C" />
                </linearGradient>
            </defs>
        </svg>
    );
}
