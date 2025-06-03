export function AnimatedBackground({ icon }: { icon?: string }) {
    return (
        <div
            className='animated-background'
            style={{
                background: `url(/${icon ?? 'star-solid'}.svg) 0 0 /3rem, url(/${icon ?? 'star-solid'}.svg) 1.5rem 1.5rem / 3rem`,
            }}
        ></div>
    );
}
