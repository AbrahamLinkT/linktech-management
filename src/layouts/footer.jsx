export const Footer = () => {
    return (
        <footer className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <p className="text-base font-medium text-slate-900 dark:text-slate-50">© 2025</p>
            <div className="flex flex-wrap gap-x-2">
                <a
                    href="#"
                    className="link"
                >
                    Política de privacidad
                </a>
                <a
                    href="#"
                    className="link"
                >
                    Términos y servicios
                </a>
            </div>
        </footer>
    );
};
