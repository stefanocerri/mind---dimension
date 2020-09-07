export const theme = {
    colors : {
        white: '#fff',
        black: '#000',
        gray: '#808080',
        grayDark: '#0B0B0B',
        primary: '#FF8A00',
        secondary: '#59FFA0'
    },

    fontSizes : {
        supertiny: '.45rem',
        tiny: '.65rem',
        small: '.85rem',
        p: '1rem',
        h1: '2.25rem',
        h2: '2rem',
        h3: '1.75rem',
        h4: '1.5rem',
        h5: '1.25rem',
        h6: '1rem',
        hero: '5.5rem',
        giant: '7rem',
    },

    flexboxgrid: {
        // Defaults
        gridSize: 12, // columns
        gutterWidth: 1.25, // rem
        outerMargin: 0, // rem
        mediaQuery: 'only screen',
        container: {
            sm: 46, // rem
            md: 61, // rem
            lg: 76  // rem
        },
        breakpoints: {
            xs: 0,  // em
            sm: 48, // em
            md: 62, // em
            lg: 75,  // em
        }
    }
}

export default theme
