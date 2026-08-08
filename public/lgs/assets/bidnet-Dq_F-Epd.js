const e="bidnet",t="BidNet — what happens to a bid, stage by stage",s="Portal pedia · 01",a="BidNet: what happens to a bid, from scrape to board",n="Every stage of the nightly run, with a real record from the actual files at each step. Two bids are followed the whole way — one that gets thrown out early, one that reaches the board as a YES. All data is from the run of 28 July 2026.",o=[{value:"2,934",label:"pulled"},{value:"2,934",label:"after dedupe"},{value:"26",label:"triage says open"},{value:"26",label:"judged"},{value:"15",label:"yes"},{value:"5",label:"maybe"}],i="Source: data/bidnet/daily/2026-07-28/stats.json. 2,908 bids were skipped at triage and cost nothing beyond a title read.",r=["Bid A · 444110192405 — Grant Administration Services. Dies at triage.","Bid B · 2711720792 — Tree Maintenance, Fort Smith National Cemetery. Ends as YES, score 76."],l=[{n:"0",title:"The memory",who:"before anything runs",summary:["BidNet keeps a permanent list of every bid ID it has ever seen. Nothing else in the system needs this file — but without it, tonight's run would treat all 84,763 known bids as brand new.","It is a lookup table: the bid ID is the key, and the value is just enough to prove when it was first seen."],cells:[{label:"The file",paths:[{path:"bidnet/native/seen-bids.json",size:"11.1 MB · 84,763 entries"}],blocks:[],notes:["Grows by roughly the number of new bids each night. Never shrinks."],tables:[]},{label:"Real entry",paths:[],blocks:[`{
 "444054897760": {
 "first_seen": "2026-06-10",
 "state": "mississippi",
 "title": "UOX Runway Safety Area ROFA Improvements"
 }
}`],notes:[],tables:[]}],notes:[],then:"the scraper reads this before it writes anything"},{n:"1",title:"Pull",who:"scripts/run_bidnet_native.py",summary:["Walks all 50 state purchasing-group pages on bidnetdirect.com, 25 rows per page, newest first. It stops paging a state as soon as a page contains nothing it hasn't already seen.","This is where BidNet differs from every other portal. Most portals save every open bid and work out what's new afterwards. BidNet does the comparison during the scrape and only writes out the new ones."],cells:[{label:"Out · only the new ones",paths:[{path:"bidnet/native/new-2026-07-28.json",size:"1.86 MB"},{path:"bidnet/native/seen-bids.json",size:"the new IDs appended"}],blocks:[],notes:[],tables:[]},{label:"Real record Bid A",paths:[],blocks:[`{
 "title": "GRANT ADMINISRATION SERVICES",
 "bidId": "444110192405",
 "solicitationNumber": "444110192405",
 "bidStatus": "open",
 "contentGroup": "",
 "location": "Mississippi",
 "timeRemaining": "",
 "publishedDate": "07/28/2026",
 "closingDate": "09/23/2026",
 "bidUrl": "https://www.bidnetdirect.com/…",
 "scrapedAt": "2026-07-28T18:16:05Z",
 "aiOverview": "The selected firm will provide
 grant administration services, including
 compliance with federal and state…",
 "publicationDateTime": "07/28/2026 06:57 AM EDT",
 "closingDateTime": "09/23/2026 11:00 AM EDT",
 "_native": true,
 "_state_slug": "mississippi"
}`],notes:["16 fields. aiOverview is BidNet's own summary text — it becomes the description everywhere downstream."],tables:[]}],notes:["Note the spelling. BidNet uses bidId. Every other portal uses bid_id. Any code that reads across portals has to handle both."],then:"deduplicated within the run"},{n:"2",title:"Unique",who:"prep step",summary:["The same solicitation can appear in more than one state's purchasing group. This step collapses those into one record before anything is paid for."],cells:[{label:"In → Out",paths:[{path:"bidnet/native/new-2026-07-28.json",size:null},{path:"bidnet/runs/sl-unique.json",size:"1.86 MB"}],blocks:[],notes:["Same size both sides on this run — 2,934 in, 2,934 out. No cross-state duplicates that night."],tables:[]},{label:"Real record — identical shape to stage 1",paths:[],blocks:[`{
 "title": "GRANT ADMINISRATION SERVICES",
 "bidId": "444110192405",
 … all 16 fields carried through unchanged …
}`],notes:[],tables:[]}],notes:[],then:"stripped down to almost nothing before the AI sees it"},{n:"3",title:"Triage — what goes in",who:"max-triage · AI",summary:["Only 5 fields survive into the AI's view. No description, no dates, no link.","That's deliberate. Triage answers one cheap question — is this even worth reading? — from the title alone. Sending 2,934 full descriptions would cost a fortune to learn that 2,908 of them are irrelevant."],cells:[{label:"In → Out",paths:[{path:"bidnet/runs/sl-unique.json",size:null},{path:"bidnet/runs/sl-triage-input.json",size:"0.58 MB"}],blocks:[],notes:["1.86 MB shrinks to 0.58 MB. That reduction is the cost saving."],tables:[]},{label:"Real record Bid A",paths:[],blocks:[`{
 "bidId": "444110192405",
 "title": "GRANT ADMINISRATION SERVICES",
 "state": "Mississippi",
 "buyer_group": "",
 "keywords_matched": ["full-feed"]
}`],notes:[],tables:[]}],notes:[],then:"the AI answers"},{n:"4",title:"Triage — what comes out",who:"max-triage · AI",summary:["Three fields. Which bid, open or skip, and one line of why.","2,908 bids get SKIP and stop here. 26 get OPEN and go on to the expensive stage."],cells:[{label:"Out",paths:[{path:"bidnet/runs/sl-triage-raw.json",size:"0.33 MB"}],blocks:[],notes:["Bid A's journey ends here. It was pulled, deduped, and read by one AI pass. Total cost: a title."],tables:[]},{label:"Real record Bid A — rejected",paths:[],blocks:[`{
 "bidId": "444110192405",
 "decision": "SKIP",
 "reason": "professional/admin services, non-fit"
}`],notes:[],tables:[]}],notes:[],then:"only the 26 OPENs continue"},{n:"5",title:"Judge — what goes in",who:"max-bid-judge · AI",summary:["Now the description finally appears. Ten fields including the full scope text and the source link.","This is the only stage where the AI reads what the agency actually wrote."],cells:[{label:"In → Out",paths:[{path:"bidnet/runs/sl-triage-raw.json",size:"the OPENs"},{path:"bidnet/runs/sl-judge-input-open.json",size:"0.02 MB"}],blocks:[],notes:["Twenty kilobytes. That's what 26 bids with full descriptions looks like."],tables:[]},{label:"Real record shape",paths:[],blocks:[`{
 "bidId": "444110192405",
 "title": "GRANT ADMINISRATION SERVICES",
 "state": "Mississippi",
 "buyer": "",
 "solicitationNumber": "444110192405",
 "publishedDate": "07/28/2026",
 "closingDate": "09/23/2026",
 "bidUrl": "https://www.bidnetdirect.com/…",
 "description": "The selected firm will provide
 grant administration services…",
 "keywords_matched": ["full-feed"]
}`],notes:["Note buyer is empty. BidNet's public feed doesn't publish it."],tables:[]}],notes:[],then:"the AI scores it"},{n:"6",title:"Judge — what comes out",who:"max-bid-judge · AI",summary:["Fourteen fields. A yes/maybe/no, a score out of 100, the reasoning, and a set of signals and warnings.","This is the record that reaches Max's board."],cells:[{label:"Out",paths:[{path:"bidnet/runs/sl-verdicts-raw.json",size:"0.04 MB"}],blocks:[],notes:["Look at what the AI hands back. title, buyer and state are facts it was given and has retyped. Across the system, one in five retyped values contradicts what was scraped. That's what the canonical-identity spec is written to fix.","Of the 26 judged: 15 YES, 5 MAYBE, 6 NO."],tables:[]},{label:"Real record Bid B — YES, 76",paths:[],blocks:[`{
 "bidId": "2711720792",
 "title": "Tree Maintenance Services,
 Fort Smith National Cemetery",
 "buyer": "",
 "state": "Arkansas",
 "would_lgs_bid": "yes",
 "score": 76,
 "category": "Cat 4 - Agency tree maintenance",
 "primary_reason": "This is a bid we already
 chased once: Houston National Cemetery,
 Tree Maintenance Services, TX 2024 -
 Go decision, submitted…",
 "service_match": "core",
 "scale_match": "unknown",
 "buyer_match": "adjacent",
 "red_flags": [
 "thin_description_pull_rfp_packet",
 "federal",
 "low_scale_inferred_single_site"
 ],
 "fit_signals": [
 "verbatim_category_4_title_tree_maintenance",
 "direct_precedent_houston_national_cemetery",
 "cemetery_work_is_in_the_win_column_baxley_ga"
 ],
 "elaboration": "Buyer field is empty in the
 feed. The title names Fort Smith National
 Cemetery, a VA site, so treat as federal…",
 "kansas_city_risk": false,
 "closed_award": false
}`],notes:[],tables:[]}],notes:[],then:"everything gets written down for tomorrow"},{n:"7",title:"The archive",who:"compile",summary:["One folder per night. This is the system's diary — and the first file in it is what tomorrow's run reads to work out what's new."],cells:[{label:"Written to",paths:[{path:"data/bidnet/daily/2026-07-28/",size:null}],blocks:[],notes:[],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["triage.json","every live bid, thin","0.33 MB"]},{header:!1,cells:["verdicts.json","the judged ones, rich","0.68 MB"]},{header:!1,cells:["new-bids.json","tonight's new, full detail","1.86 MB"]},{header:!1,cells:["disappeared.json","bids gone since last run","1.11 MB"]},{header:!1,cells:["changed.json","field-level changes","empty"]},{header:!1,cells:["stats.json","the funnel counts","tiny"]},{header:!1,cells:["report.md","human-readable summary","0.22 MB"]}]]},{label:"triage.json — tomorrow's memory",paths:[],blocks:[`{
 "bidId": "444110192405",
 "decision": "SKIP",
 "reason": "professional/admin services, non-fit"
}`,`{
 "bidId": "2710116587",
 "title": "6515--GSI AudioStar Pro Channels",
 "state": "Georgia",
 "last_seen": "2026-07-24",
 "bidUrl": "https://www.bidnetdirect.com/…"
}`,`{
 "date": "2026-07-28",
 "scan_method": "native:bidnet-full-feed",
 "raw_items_pulled": 2934,
 "unique_after_dedupe": 2934,
 "triage": { "open": 26, "skip": 2908 },
 "scoring": { "yes": 15, "maybe": 5, "no": 6 },
 "lgs_core_state_yes": 5
}`],notes:[],tables:[]}],notes:[],then:"BidNet's own work is done — everything below is shared with the other portals"},{n:"8",title:"Carry forward — the safety net",who:"2.5 · carry_forward_verdicts.py",summary:["Tonight's archive only contains bids the portal showed tonight. If a bid dropped out of the pull for one night — a page failed, the ranking shifted — its verdict was never written, and it is gone from the board.","It would never come back. Triage only looks at bid ids it has not seen before, and it has seen this one. So it is never judged again.","Carry forward reaches back through the old nights, finds verdicts for bids missing from tonight, and keeps them alive for up to 90 days."],cells:[{label:"Why it exists — from the code",paths:[],blocks:[`2026-05-31: changed from INTERSECT to
UNION+age-cap after Shessi caught
Hialeah FL Disaster Debris (judged
YES 88 on 05/23) had its verdict
permanently dropped on 05/24 because
the bid temporarily fell out of that
day's top-100.

The bid was still open on BidNet;
our system forgot the verdict and
never re-judged it.`],notes:[],tables:[]},{label:"What stops a bid being carried",paths:[],blocks:[],notes:["How it recognises a bid. It works on bids that are not in tonight's pull, so it cannot look them up in the snapshot. It matches on agency + solicitation number, then number alone, then the title — because some portals hand out a new id for the same bid."],tables:[[{header:!1,cells:["closed_award is true","it is an award notice, not a bid — someone already won"]},{header:!1,cells:["first judged > 90 days ago","the age cap, so verdicts do not accumulate forever"]}]]}],notes:[],then:"now every portal's verdicts are complete"},{n:"9",title:"Ledger, reports, dashboard files",who:"2.6 – 2.8",summary:["Three tidy-up steps before anything reaches the database."],cells:[{label:null,paths:[],blocks:[],notes:[],tables:[[{header:!1,cells:["2.6","Rebuild the running list of every live YES across every portal"]},{header:!1,cells:["2.7","Rewrite every portal's report into one shared layout, so bidnet's report and norta's look the same"]},{header:!1,cells:["2.8","Rebuild the three files PortalPro reads — the bid list, the activity matrix, the field-coverage table"]}]]}],notes:[],then:"bids stop being portal-shaped here"},{n:"10",title:"Everyone's bids become one board",who:"2.85 · publish, cluster, dedup",summary:["The YES and MAYBE bids go into Supabase. Then every bid is grouped into a cluster — one cluster means one real opportunity, however many portals listed it.","Matching is done by code first. What code cannot match, an AI judge looks at and decides. Confirmed merges are stored permanently, so a future re-clustering cannot undo a decision that was already made."],cells:[{label:"In order",paths:[],blocks:[],notes:[],tables:[[{header:!1,cells:["1","Push bids, portals and run counts into Supabase"]},{header:!1,cells:["2","Delete bids that have closed, so the board shows only open work"]},{header:!1,cells:["3","Build clusters — code matching first"]},{header:!1,cells:["4","Ask the AI about the pairs code could not decide"]},{header:!1,cells:["5","Collapse the confirmed matches into single clusters"]},{header:!1,cells:["6","A second AI writes one merged description per cluster"]}]]},{label:"What Bid B might hit here",paths:[],blocks:[],notes:["This is where the board's promise lives. The whole point of the product is that duplicates are gone. It happens here, and nowhere else.","If BidNet and SAM.gov both listed the Fort Smith cemetery job, they arrive as two bids and leave as one cluster. Max sees one row, not two."],tables:[]}],notes:[],then:"now go and read the actual documents"},{n:"11",title:"Read the RFP, pull out what you must do to bid",who:"2.87 · documents and requirements",summary:["For each cluster: download the documents, turn PDFs and Word files into text, then an AI reads them and pulls out the bond, the insurance, the licences, the pre-bid meeting, the questions deadline and how to submit.","Every finding carries a word-for-word quote from the document. No quote, no finding."],cells:[{label:"The order that matters",paths:[],blocks:[],notes:[],tables:[[{header:!1,cells:["a","Pick which clusters need re-reading — new documents, changed page, or a human hit Re-extract"]},{header:!1,cells:["b","Turn documents into text. Twice-failed documents are marked dead and never retried"]},{header:!1,cells:["c","Build the bid packs first — the AI reads the packs, so they must exist before it runs"]},{header:!1,cells:["d","The AI pulls out the requirements"]},{header:!1,cells:["e","Write them back, and write a reason for anything that could not be found"]}]]},{label:"Limits built in",paths:[],blocks:[],notes:["Step c before d is not cosmetic. It was caught as a real bug on 2026-07-11 — the AI was reading packs that had not been built yet."],tables:[[{header:!1,cells:["180 clusters a night","anything past that waits for tomorrow"]},{header:!1,cells:["soonest closing first","so a truncated night still does the urgent ones"]},{header:!1,cells:["past-due bids frozen","no point reading a bid that already closed"]}]]}],notes:[],then:"new information means new matches are possible"},{n:"12",title:"Match again, now that the blanks are filled",who:"2.875 · dedup, second pass",summary:["Reading the documents just filled in buyers and closing dates that were empty an hour ago. Two bids that looked unrelated may now obviously be the same job.","So dedup runs a second time on the newly comparable pairs."],cells:[],notes:[],then:"what changed since last night?"},{n:"13",title:"Notice changes, send the mail, check the run",who:"2.88 · watch, emails, sentinel",summary:["This stage watches bids you are already tracking, sends the digests, and then audits the whole night."],cells:[{label:"Watching and mailing",paths:[],blocks:[],notes:[],tables:[[{header:!1,cells:["Re-capture the source page and compare it to last time"]},{header:!1,cells:["Record what moved — a new closing date, a new addendum"]},{header:!1,cells:["Discovery digest — what was found today"]},{header:!1,cells:["Watch digest — what changed on bids you track"]},{header:!1,cells:["Deadline alerts — closing dates coming up"]},{header:!1,cells:["Expiring contracts digest"]},{header:!1,cells:["Storm map feed"]}]]},{label:"The sentinel",paths:[],blocks:[],notes:["The emails are dead right now. They need a Resend key that has never been set. Everything else in this stage runs.","Checks that every portal actually completed every phase. This is the thing that would have caught opengov-ports dying silently for 21 days."],tables:[]}],notes:[],then:"rebuild the packs with tonight's requirements"},{n:"14",title:"Packs and boards",who:"2.89 – 2.96",summary:["Each bid gets a folder of plain markdown — the scope, the documents, the requirements, the history. That folder is what an AI reads when you ask a question about a specific bid.","Then three operator boards: the monitor board for trends, the overview board for tonight's run status, and a per-portal matrix showing which fields each portal is actually filling."],cells:[],notes:[],then:"the last two steps"},{n:"15",title:"Roll-up, then the scorecard",who:"3 – 4.99 · the end",summary:["The roll-up reads every portal's archive and writes one page: what ran, what it found, the top bids of the night.","Then the scorecard. It is the only YES number to quote. Every other count in the system is a working number — the scorecard is the one you can say out loud to a client."],cells:[{label:"Where the night ends",paths:[],blocks:[],notes:[],tables:[[{header:!1,cells:["PortalPro / shessi.dev/lgs","the board Max and the team work from"]},{header:!1,cells:["the four digest emails","discovery, watch, deadlines, expiring contracts"]},{header:!1,cells:["the bid packs","one folder per bid, the base for asking questions"]},{header:!1,cells:["monitor and overview boards","trends, and whether tonight's run was healthy"]},{header:!1,cells:["roll-up and scorecard","the day's numbers"]}]]}],notes:[],then:null}],d=[{heading:"Where BidNet differs from the other portals",tables:[[{header:!0,cells:["Thing","BidNet","Most portals"]},{header:!1,cells:["Where the new/old comparison happens","inside the scrape, against a permanent ID list","after the scrape, against last night's archive"]},{header:!1,cells:["What the scraper writes","only the new bids","every open bid"]},{header:!1,cells:["How far back the memory goes","forever — 84,763 IDs","one night"]},{header:!1,cells:["The ID field","bidId","bid_id"]},{header:!1,cells:["Where the working files live","bidnet/native/ and bidnet/runs/","data/{portal}/bids/ and runs/"]},{header:!1,cells:["Tracks what disappeared","yes","only centralauctionhouse"]}]],paragraphs:["Every file path, size and record on this page was read from the repository on 3 August 2026. The run shown is 28 July 2026, the most recent complete archive. Long text values are truncated with an ellipsis; nothing else is edited."]}],h=null,c="docs/portal-dataflow/pedia-bidnet.html",u={slug:e,title:t,eyebrow:s,headline:a,lede:n,funnel:o,funnel_note:i,legend:r,stages:l,sections:d,footer:h,source_page:c};export{u as default,s as eyebrow,h as footer,o as funnel,i as funnel_note,a as headline,n as lede,r as legend,d as sections,e as slug,c as source_page,l as stages,t as title};
