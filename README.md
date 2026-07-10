# NiceSalt.com

Astro site for NiceSalt, built for Vercel.

```sh
npm install
npm run dev
npm run build
```

## Contact Form

The contact form posts to Web3Forms. Add this environment variable in Vercel:

```sh
WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
```

Create the key at `https://web3forms.com/` for `hello@nicesalt.com`. If the key
is missing, the form falls back to a pre-filled email draft instead of sending
visitors to a broken provider page.
