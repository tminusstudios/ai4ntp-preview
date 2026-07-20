# AI4NTP Session 006 Talk Track

- **Presenter:** Justin Novak
- **Session:** 006, "7 AI agents we built to run our company"
- **When:** Sunday, July 12, 2026, 2 PM ET, live on Zoom
- **Canonical living copy (edit here):** https://docs.google.com/document/d/1MlMNQqy63cptnOMkgShZDNQpnfRQ6vkHKjKh7USmuHk/edit
- **Voice guide:** `sessions/_template/voice-and-tone.md`. Part of the AI4NTP talk-track corpus.
- Bracketed italics are stage directions, not spoken. No em dashes (brand rule).

---

## 0 · Cold open / welcome
*[Slide 1, the headline. ~2 min. Let the room fill.]*

Hey everybody, welcome in. Give us a second while the room fills up. While you're getting settled, do me a favor and drop two things in the chat: where in the world you are joining from, and the one job in your business you wish you never had to do again. Hold onto that second one, it'll matter later.

Alright. Welcome to Session 006 of AI4NTP. If you're new here, our whole thing is simple.

Real operators showing you exactly how we use and build with AI.

No theory, no gatekeeping.

Everything we show you today, you can go build yourself.

Here's the promise for the next hour. We run our company on AI agents.

Not chatbots we type into, actual agents doing real work every day that never sleep.

Today we're opening the hood on seven of them. The ones that save us time, save us money, and make us more money.

For each one we'll show you what it does, why we built it, and enough of the how that you can build your own version, or get inspired to do something more relevant to your operations.

One housekeeping note: ask questions any time in the chat. We have a Q&A at the end, but we'll pull good ones as we go. Let's get into it.

---

## 1 · Agenda
*[Slide 2, the agenda. ~1 min.]*

Here's how the hour runs.

One, the seven agents. These are the agents running our company right now. For each one: what it does, why we built it, and how you can build the same.

And Q&A at the end.

Sound good? Let's start with the obvious question.

---

## 2 · What is an agent
*[Slide 3. ~2 min. This tracks the slide word-for-word so the audience reads along with you.]*

What actually is an agent? Because the word gets thrown around a lot right now.

Here's how we think about it. An agent is a custom system you configure to do the work itself. You give it a plan, it combines your tools, and it does not stop until the job is done.

The key word there is worker. This is not a chatbot you prompt one answer at a time and then copy and paste the result. It's a digital worker you hand a job to and walk away.

And here's the part that changes everything. It's always on. It never sleeps. It's working while you're asleep, while you're on a call, while you're with your family.

Three things make something an agent. One, a goal: you set the target. Two, tools: it uses your actual stack, your email, your CRM, your docs. Three, autonomy: it runs on its own and keeps going.

Hold that picture, because you're about to watch seven of them in action.

---

## 3 · Who we are
*[Slide 4, the three of us. ~2 min. Trust, fast. Your own intro stays short because you go deep in Agent 1.]*

Before we dive in, thirty seconds on who's talking, so you know why you can trust what you're about to see.

I'm Justin. I sold my first company out of my college dorm room, spent the last decade in growth and go-to-market, and helped companies get acquired and others scale past a hundred million.

Everything I'm about to show you, I built and run inside AI4NTP and for our clients.

Ian has been building since before most software existed. Decorated entrepreneur, worked with public companies, built across just about every industry you can name. He runs a personal fleet of agents doing real work every day, and he's built well over a hundred of these solutions in the last year alone.

Alec started building agents inside a big company, quit, and got hired right back by his own client to build agents for them. Now he travels to train whole teams to use AI, and he lives in these tools daily.

So that's us. Three operators who do this for a living. Let's show you the work. I'll go first.

---

## 4 · Agent 1 · How I make a month of content in a day
*[Present live from the Figma flowchart board, not slides. The raw board creates curiosity ("what is all this stuff?") and shows a glimpse of the future a polished deck can't. Structure: Headline, Problem (two), Credibility, Solution (the six-agent pipeline), Big idea.]*

Alright, I'm going to kick us off.

I'm going to show you exactly how I create a month's worth of content in about one day of work, so I can spend my time working on the business instead of getting stuck inside of it.

*[Pull up the Figma board.]*

This right here is the whole system. Don't worry about the detail yet, I'll walk you through every piece. But this is what a month of content actually looks like behind the scenes.

Two problems here.

First, content creation is very, very time-consuming. And if you outsource it, it's expensive.

To get the output I'm about to show you, I'd need a team of three or four junior marketers, and each one runs about sixty grand a year minimum.

That's north of two hundred thousand dollars in headcount, for what one day of my time and a set of agents now produces.

Second, and this one's bigger: the moment you hand your content to an agency, a VA, or someone brand new to the team, it loses your voice.

And as a founder, your content is how you represent yourself at scale. It's your face on the internet. It's often the very first touchpoint a prospect ever has with you.

So it has to sound like you and look like you: your brand voice, your colors, your tone. That's exactly why I stay close to it.

Luckily, I've been doing this since I was a teenager, building from my college dorm room, growing businesses. One of the social accounts I started back then now has over a million followers. So we've done this before. Now we're doing it again, for AI4NTP. *[Engage the room.]*

Here's the solution. And here's the one thing I want you to take away before I walk the flow: this is not one big agent. It's a chain of specialized agents, each one built for a single step. Let me show you.

- **One, distribution.** Every episode starts with a phone call with Ian and Alec, which turns into a landing page, and we push it out omnichannel: Eventbrite, Zoom, Instagram, social, email, paid ads. That entire distribution push is run by an agent. We keep a human in the loop for quality control, because I will not send slop, but the agent does the heavy lifting to get the right people into these rooms we're in right now together.

- **Two, the session.** This hour we're spending together right now? It becomes an hour of content. And the mistake most people make is letting that hour vanish into the void. We don't. It goes straight to YouTube.

- **Three, shorts.** An agent takes that YouTube video and cuts it into five to ten shorts, then distributes them across X, Instagram, YouTube, and TikTok. So five to ten shorts become twenty to fifty pieces across every channel. If you're already making the content, and an agent does the cutting, there is no reason to post it in just one place.

- **Four, the landing page.** We take the transcript of this session, which is our exact voice and tone, the words coming out of my mouth right now, and we feed it to another agent that builds a landing page. When we wrap today, I'm going to email every one of you that page. And it is not AI slop. It's built directly from what we actually said, so there is no room for hallucination, and we layer guardrails on top of that. That page then lives on our site forever, compounding, building SEO and topical authority, which is exactly what you need to rank on Google and inside ChatGPT, Perplexity, and Claude.

- **Five, the tools page.** That landing page feeds our tools page, where we list every tool we've ever talked about. An agent pulls each tool from the transcript and spins up its own page: what the tool is, how and why we used it, what we said about it, and who demoed it. That's real credibility and real content, which is what Google and the LLMs reward. We're already ranking for tools we published in past sessions, because Google sees them as the real thing, not AI slop.

- **Six, Instagram.** Every session also becomes an Instagram post, built by an agent we call Pulsar. Clean, on-brand, right colors, right voice, every single time, because of the guardrails we built in.

Big idea. Now step back and look at the whole board. Page creation, distribution, YouTube, shorts, landing pages, tool pages, Instagram. Every one of those is its own agent. Not one giant do-everything bot: a team of specialists I built, each doing one job well. One day of my time, and this runs all month, compounding while we sleep.

I even built a model that reverse-engineers exactly what we need to post, and how many of these sessions we need to run, to hit a million subscribers. Happy to show that too if you guys are interested after Q&A.

---

## 5 · Agent 2 · Mission Control
*[Demo live from the Mission Control app. Two hero moments: the AI reply, and the one-click monthly report. Use a clean, condensed demo thread and report, not the fifty-open-ticket one, so "generate" is fast on screen. Structure: Headline, Problem, Solution (intake, AI reply, time tracking, reporting), Big idea (the architect analogy).]*

Agent number two. This one is called Mission Control.

I replaced eight-plus tools with one system I built in-house.

Email, project management, Asana, time tracking, Google Docs, billing, client reporting, and tasks. All of it, folded into this.

The problem was simple, and I think a lot of you feel it. We were running the business across a dozen disconnected tools. Nothing talked to anything else. And every hand-off between them was a place where time leaked out and things slipped through the cracks.

Solution. So I took all the tools we used every day, and I rebuilt them, custom, with agents baked into every step. This is where I live now. Let me show you a few things.

- **Intake.** Every request, no matter where it starts, lands right here in one place, and the whole team gets notified instantly, in the app and over email. Before this, a request would come in over a phone call, a Slack, or an email to one person, and nobody else had visibility. Now nothing slips.

- **The AI reply.** *[Open a real client thread. Hero moment one.]* Here's a client email. They need a video. Watch this. I click one button, Draft AI Reply. *[Click it.]* In about ten seconds, it reads this entire thread, everything that's happened, everything that still needs to happen, and it writes a complete, ready-to-send follow-up that sounds exactly like me. And it sounds like me because I trained it on my own voice, on all of my historical emails. *[Show the drafted reply.]*

  Now, some of you are thinking, Gmail already does this. It does have a version built in. But here's what I found when I actually used it: Gmail doesn't get your tone of voice, and it doesn't hold the full history of what's happened with this specific client. This one does both. That is the whole difference between a generic AI feature and an agent you've configured for your business.

  And it's the same thread for my team and my client. I can leave internal notes for my teammates, and reply straight to the client, from one place. I can even drop in a call transcript and it summarizes the whole thing for me.

- **Time tracking.** As we do the work, it logs it: who did it, which client, which project, which agent. Some clients I bill hourly, some I don't, but either way my team logs time, so we stay accountable and the client always knows exactly what we're working on. And that feeds billing and payroll automatically.

- **Reporting.** *[Hero moment two. Use the clean demo report.]* This is the one that used to eat my life. At the end of every month I would spend hours digging through a month of notes to tell a client what we did. Now? I click New Report, This Month, Generate. *[Click it.]* In under a minute, an agent reads every thread and every task and writes it all up: what we did, what we delivered, the status of each item, open, in progress, waiting, or complete, the hours we spent, the tasks we closed. If we're running their marketing, it'll even pull social analytics.

  And the output is a clean, shareable report on a gated link. *[Show the finished report.]* I send the client the link and their own password, so it's secure and no one else can see it. They open it and get a professional monthly overview, right down to the hours billed. Hours of my work, gone, replaced by one click.

**Big idea: be the architect.** Here's the big idea, and it's the whole philosophy behind everything we're showing you today. This is about taking your entire workflow, every tool you touch, and consolidating it into one custom system you actually own.

Think about it like this. Most software is a house someone else designed, and you just move in and live with whatever you got. Building your own is like hiring an architect to design the exact house you want to live in, except you are the architect. I built all eight of these for myself, custom to how I work, with close to seventy agents running inside. It saves me time, it makes me more efficient, and it makes me look far more professional to my clients. And this is just my desk. Now imagine it across your whole organization.

---

## 6 · CTA · soft pitch

This is what we do for a living, and have for years. We build custom agents for companies to solve the exact problems you're feeling right now. We keep our capacity tight on purpose, so the work stays high quality, but we do have a few slots opening up.

So if you're curious what this could look like for you, here's the link. *[Point to it.]* Raise your hand, tell us a little about your business, and we'll take it from there. No hard pitch, just a conversation.

---

### Production note: lock the CTA link before going live
- **ai4ntp.com/agents** — the Agents-as-a-Service page with the Apply form (best if you want people to self-qualify first).
- **ai4ntp.com/calendar** — books a call directly (best if you want the conversation fast).
