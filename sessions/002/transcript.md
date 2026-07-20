# Episode 002 · Transcript

Auto-transcribed from the Zoom recording. Speaker labels inferred from context. Light cleanup only (proper nouns, obvious transcription errors), no editorial rewriting. Source VTT: `raw/AI4NTP Session 002 Transcript.cc.vtt`.

---

**Justin · 00:23** — Welcome, everyone. Drop in the chat where in the world you're joining from. Ohio, Edinburgh, Kentucky, Bahrain, New Jersey, San Francisco, Dubai, Atlanta. We're going global. This is a 60-minute session and we're going to build a company in real time using AI: a brand identity, a website, and a go-to-market motion including a newsletter and social. AI does the heavy lifting. What makes it unique is that you pick what we build. Nothing is pre-baked. I'll drop a link in the chat; submit the idea you want us to build, and then we'll all vote on it.

**Justin · 01:38** — I'll share my screen. Brett is co-moderating today. Brett, let's get you up on stage while everyone completes the quiz.

**Brett · 01:47** — Hey y'all, glad to be here. What you can do now with AI, in a fraction of the time it used to take, is incredible. Excited to see what we build. Look at this one: "Build an AI filter to always give Brett the best hair in the room. Name idea: NOBALDIES." I like that.

**Justin · 02:28** — Let's wait for a few more. Workforce transformation system. Online workout planning, that's cool. Done-for-you movie rights, "Indify." All right, get your submissions in. We'll run the AI synthesis and then you all vote on what you want us to build.

**Brett · 03:02** — My favorite so far? I'm already fixing to go do an adult go-kart business. And "something for parents and children staying afar," that's cool too. I like all of these.

**Justin · 03:24** — Seven submissions so far, about 60 people here. So what happens when you run the synthesis? It runs a prompt through Claude that turns the raw ideas into full-fledged businesses. "A tech business to monitor AI solutions" becomes "AI Watchdog." We click Run AI synthesis, and now you can open the link again and vote live.

**Justin · 04:29** — The options are up: GotoBuild, KartPass, Watchdog, Yeskia, NOBALDIES. Everybody submit your vote. Whatever wins is what we build.

**Brett · 04:50** — KartPass took the lead. Now GotoBuild has it. I feel like Jeff from Survivor over here.

**Justin · 05:51** — Locked. We're building GotoBuild: personalized weekly workout plans, generated and updated by an AI that remembers you. Ian, I think you'll dig this one. Hannah, since GotoBuild was your idea, email me at justin@ai4ntp.com, I've got a giveaway for you.

**Brett · 06:27** — So we've got our business and who we're targeting. Let's start with Ian. We've got an idea, we want to build this company. Where would you start?

**Ian · 06:50** — This is a very high-speed brand kit, and 15 minutes is not much time. Typically this would take weeks of back-and-forth. I'd start with Behance, my go-to for inspiration. It's an Adobe product where the best designers post their work, so I go there to feel out the industry and design trends. For a personalized workout planner most results are apps, and the brand space is all over the place, so I'll narrow to a workout logo and brand identity.

**Ian · 08:29** — I'm seeing bold fonts, lime colors, some blue. Next I switch to Midjourney, a text-to-image model. I'll find a reference that fits a workout planner, then take it into ChatGPT and say, "make me a logo for a workout planner called GotoBuild." Hannah wants yellow and a sans serif, so let's fold that in.

**Brett · 10:21** — Good feedback in the chat: Hannah thinks the logo should be more gender-neutral. And she likes the banana barbell.

**Ian · 10:45** — A yellow banana barbell, let's go with that. (To a chat question: Midjourney has a free account, around 10 images. I usually start from an existing image and remix it.) Now I'll take the logo to my OpenClaw agent. He's named Eian, my digital clone. I'll tell him it's GotoBuild, a personalized weekly workout planner, here's the logo, make a brand kit. He's running a GPT-5.5 brain and will publish a brand kit to my site that I'll hand to Justin and Alec.

**Brett · 12:30** — For anyone just joining: we polled the audience and we're building GotoBuild, a personalized weekly workout plan. Ian's chosen yellow and a banana, and he's using OpenClaw in the background to build the brand kit.

**Ian · 13:08** — While that runs, I'll go to Pexels for rights-free stock photos to set the photo direction. Let me check the brand-kit URL, empk.com/gotobuild, still working. I'll pull fonts from Google Fonts, which are free and usable directly on your site. I like Archivo, it has a great bold italic, so I'll tell the AI to use Archivo and pick a secondary font.

**Ian · 16:13** — Now Instant Domain Search for "gotobuild." I prefer Namecheap, about 60% of GoDaddy's price. GoToBuild.pro is available for one cent on a three-year term. I'll buy it and point it at the final product when we're done.

**Ian · 17:21** — Quick color theory: yellows and limes are vibrant and energetic. Blue is a cooler color that sets things apart and connotes trust, which is why banks and big tech use it, so it's great for a call to action. This palette is gender-neutral and on point. I'll make the brand kit downloadable as HTML or PDF, but you can also just give the link to Claude or ChatGPT and it reads the styles and stays brand-aligned.

**Ian · 19:58** — Audience and voice and tone are part of the brand kit. Positioning is right here: busy beginners, returning lifters, casual athletes, and people who like structure but don't want to become spreadsheet monks. That fits what Hannah asked for. Alec, I'm sending you the link, go build your part.

**Alec · 20:57** — I'll share my screen. I've got Lovable and Claude Code open. Lovable is more beginner-friendly; Claude Code is a bit more advanced with a couple of extra steps to production. I'll build with both and we'll compare results.

**Brett · 21:41** — Quick recap for anyone joining: this is a live build. Ian built a brand kit from Hannah's idea, GotoBuild, a gym. Now Alec takes that brand kit and builds the customer-facing website.

**Alec · 22:06** — What Ian did in 15 minutes used to take days or weeks. I'll grab inspiration from existing workout sites, go a bit darker, and feed it in as context, because more context means a better first output. I'll use Fireshot, a Chrome extension that screenshots an entire site in one go (shout-out to Ian for that), and drop it into both Lovable and Claude Code.

**Justin · 25:02** — Ian, how much do you spend a month on everything you used? Ian: Midjourney is about $29, ChatGPT is $20, and Behance, Pexels, and Google Fonts are free, so around $50. Fifty bucks and 15 minutes for that entire brand identity. Chat, what do you think of Ian's build?

**Alec · 27:34** — I'll prompt with Wispr Flow, voice dictation I use every day: "We're building a workout app, build the landing page, I attached an example and our brand kit." I'll let Lovable and Claude Code build side by side. Context is everything.

**Alec · 31:11** — First Lovable output is in line with the brand kit, with some nice animations. Claude's is more in line with the example site, very polished, more of an app look. (To the chat: Lovable or Claude? The room splits.) Let's try to add functionality: an AI workout-plan generator. I'll add an API key and build it so you input your age, goals, and days, and it returns a weekly plan. For everyone who isn't a developer, be careful with your API keys.

**Ian · 39:13** — To build on that, these are great prototyping tools. They don't make you a great designer or developer, so still find experts to check your work, but for prototyping it's a fantastic starting point. For someone like me who isn't a designer, getting inspiration, capturing it, and letting AI generate from it is huge.

**Alec · 40:34** — Lovable has the API built in, so you don't have to wire it up in a developer console, another reason it's good for starting out. When you hit errors, and you will, Lovable has a "try to fix" button that feeds the logs back to the AI. Errors are normal; AI debugs in seconds what used to take a developer hours or days.

**Alec · 44:27** — That's a good example of the difference: Lovable is strong for a quick site, Claude Code for back-end functionality. If you're starting out, start with Lovable. I'll hand off to Justin. (To Ali's chat question: you can use Claude Code in the app, the browser, or VS Code; I use VS Code with the plugin.)

**Justin · 47:59** — Ian did the branding in 15 minutes, Alec built the site. Alec, publish it to the domain so we can preview, and Ian can wire up DNS while I work on my part. Hannah likes Lovable, so let's deploy that one.

**Justin · 49:03** — My segment is the go-to-market motion. You launch a startup, now what? There's a "build it and they will come" fallacy. You need a motion to acquire customers: knocking on doors, mailers, emails, ads. For a local gym you can target a 5-to-10-mile radius, run events, referrals, Google Ads, reviews, social. But most teams miss the middle of the funnel, nurturing prospects, and a newsletter is incredible for that. You build topical authority and stay top of mind, so when someone is in-market you're the go-to.

**Justin · 52:31** — I built this tool, Pulsar, for myself. I spun up a GotoBuild brand and set a brand voice, words we use, words we don't, who the audience is, plus preferred phrases like "skip leg day," and made the tone playful and casual. I uploaded Ian's brand kit as brand intelligence so the colors and voice match.

**Justin · 54:46** — A newsletter isn't all original content; you curate and add an editorial layer. I'm adding sources, gyms in Pittsburgh, free diet plans, workout routines. (Audience suggests nutrition, recipes, the science behind exercise.) Then I click "draft issue." It costs 20 cents, scrapes the articles, and rewrites them in our voice, with credit to the sources.

**Justin · 58:14** — Here's the preview: top stories, quick hits, a quote in our voice, "None of those meal boxes will adjust your macros because you skipped leg day," and local Pittsburgh weather. I'll approve and ship it to Beehiiv, which distributes it and lets you own the audience. That's a newsletter in under five minutes.

**Justin · 60:42** — Where it gets fun: from one newsletter you can spin out about 30 pieces of content. Generate three blogs for 30 cents on Haiku, then social assets with captions and on-brand imagery, square or landscape, download the PNG and post. I built this because newsletters ate hours of my team's time. Start by finding where you spend 5 or 10 hours a week and replace yourself there.

**Ian · 65:33** — While you all were building, I expanded the brand kit. Hover a color to copy it. I added an AEO/GEO page, answerable pages, citable structure, LLM-readable maps, and an llms.txt file, which tells LLMs about your site. Copy it into a file called llms.txt, upload it to your root, or hand it to Lovable. I also added programmatic SEO pages, a competitive analysis, and a growth plan: prove the promise with demos and founder-led content, then PSEO, then scale what converts, and always A/B test.

**Alec · 69:18** — The domain is hooked up and the site is live at gotobuild.pro, and the plan-building functionality works now too. We went zero to one this hour, a live site with real functionality.

**Audience (Jean-Jacques) · 72:18** — I'm very impressed by the systems. How do we learn to set up an OpenClaw like Ian's, linked to your own domain, or a system like Justin's Pulsar?

**Justin · 72:18** — Great question. Ian and I were just talking about doing an OpenClaw setup training, and we'll run these sessions roughly weekly. Email me and I'll give you free access to the Pulsar tool so you can help me improve it. Ian: there's a need for video, so I'll produce some and put it on AI4NTP.

**Audience (roofer AI receptionist) · 74:11** — I'm selling AI receptionists to roofers. Can I use Claude to get leads for free, instead of paying a lot for Phantom Buster?

**Alec · 74:11** — Use Apify's free tier with the Google Maps scraper: search "roofers" and pull them by geo. Or ask Claude Code to build a scraper for roofing contacts. Apollo.io is another option. Then make the dials, and honestly hope they don't answer, because a missed call is a smoking-hot prospect, they're missing money.

**Alec · 77:00** — One takeaway: be resourceful. You can do anything. He asked for a free alternative to a paid scraper, and the answer is to tell Claude you need one. The only limitation is your imagination. Two things matter: tool awareness, and actually using the tools. The bar to being a top-1% AI user is low, so keep showing up and trying things.

**Ian · 80:03** — If you don't know how to do something, that's a great question for Claude or Perplexity, ask it to walk you through as if you know nothing. Before this year I'd never built a database or heard of AEO or GEO. Follow your curiosity; AI is like a mech suit.

**Justin · 81:42** — We just designed, built, and launched a startup in under an hour, with AI doing the heavy lifting, and you can do the same thing this weekend. We'll keep doing this about every week, with more on OpenClaw, hackathons, and guest deep-dives. The reason we do this is that so much content out there is theory; our mission is to show and tell with full transparency, so you can apply it the same day. See you in Episode 003.

**Brett · 82:48** — Hannah, let me know when the banana gym opens. I'll get my lift on. Not legs.
