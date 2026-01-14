export const Footer = () => {
    return (
        <footer className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <p className="text-base font-medium text-slate-900 dark:text-slate-50">© 2026</p>
            <div className="flex flex-wrap gap-x-2">
                <a
                    href="#"
                    className="link"
                >
                    Politica de privacidad
                </a>
                <a
                    href="#"
                    className="link"
                >
                    terminos y servicios
                </a>
            </div>
        </footer>
    );
};
