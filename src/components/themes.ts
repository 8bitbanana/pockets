import { extendTheme } from "@mui/joy";

declare module '@mui/joy/button' {
    interface ButtonPropsSizeOverrides {
        xs: true
    }
}

const pocketsTheme = extendTheme({
    components: {
        JoyButton: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    ...(ownerState.size === "xs" && {
                        '--Icon-fontSize': '1rem',
                        '--Button-gap': '0.25rem',
                        minHeight: 'var(--Button-minHeight, 1.75rem)',
                        fontSize: theme.vars.fontSize.xs,
                        paddingBlock: '2px',
                        paddingInline: '0.5rem',
                    })
                })
            }
        }
    }
});

export { pocketsTheme };