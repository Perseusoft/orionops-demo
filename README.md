# OrionOps live demo

This repository is the playground for the **OrionOps live demo**.

Visitors of the OrionOps demo organization create tickets in plain language
("add a pricing section", "make the hero darker", "write a post about X").
OrionOps AI agents pick each ticket up automatically, implement it on a branch
and open a pull request here. The owner reviews and merges; the site is
published with GitHub Pages from `main`.

- Live site: https://perseusoft.github.io/orionops-demo/
- Pull requests opened by the agents: see the *Pull requests* tab
- Learn about OrionOps: https://orionops.tech

## How this repo is structured

A deliberately simple static site, no build step:

```
index.html      landing page (hero, features, pricing, blog list)
blog/           one HTML file per post
assets/         styles.css and site.js
```

Agents are expected to keep it that way: plain HTML/CSS/JS, no frameworks,
no build tooling. Every change must keep the site working when served as
static files.

## Conventions for tasks

- One ticket = one branch = one pull request.
- Keep the design consistent with `assets/styles.css` (CSS variables at the top).
- New blog posts go in `blog/<slug>.html` and get a card in `index.html#blog`.
- Do not touch `.github/` or this README unless the ticket asks for it.

## Housekeeping

Branches and pull requests from the demo are cleaned up automatically after
24 hours. Nothing here is production code; break it, it will be rebuilt.
