const e="bidprime",t="BidPrime: what happens to a bid, stage by stage",a="Portal pedia · 08",s="BidPrime: what happens to a bid, from a paid inbox to the board",n="BidPrime is a paid alert service. We log into a trial account with a hidden browser, ask its inbox for the 100 newest notices, and log straight back out. Every stage below carries a real record from the actual files. Two bids are followed the whole way. One is killed at triage. The other reaches the board as a YES at score 88. All data is from the run of 28 July 2026, run id 20260728-124957.",i=[{value:"100",label:"pulled tonight"},{value:"100",label:"all new, all triaged"},{value:"86",label:"triage says skip"},{value:"14",label:"triage says open"},{value:"12",label:"yes"},{value:"1",label:"maybe"},{value:"1",label:"no"}],o="There is no stats.json for BidPrime. This portal writes exactly one file into its daily folder: data/bidprime/daily/2026-07-28/new-bids.json (385,735 bytes, 100 rows). Every count above was therefore read straight out of the run files: bp-aegisswarm-20260728-124957-triage-decisions.json (8,354 bytes, 100 rows) for the 86/14 split and -verdicts.json (23,688 bytes, 14 rows) for the 12/1/1, both in data/portals-pipeline/. 100 is not a coincidence: the inbox will not hand over more than 100 in one call.",r=["Bid A · 9d4d6921… · RFP - Street Tree Planting Services, Village of Greenville WI. Dies at triage.","Bid B · 3ec68ab2… · On-Call Tree Trimming, Removal & Stump Grinding, Lexington County SC. Ends as YES, score 88."],l=[{n:"0",title:"The memory, and the gate",who:"data/bidprime/seen-bids.json · scripts/portal_due.py",summary:["BidPrime remembers with one flat list of ids. The pull walks the newest notices in order and stops dead at the first id already in that list, because newest-first means everything after it is older.","No daily run has ever stopped early. Seven days have a daily archive. Each holds exactly 100 rows. The store holds exactly 700 ids. Zero overlap, ever. So on every one of those nights BidPrime had published more than 100 notices since the run before, and everything past the hundredth was pushed off the page before we looked. Those bids are gone for good. No later stage can rescue what the pull never saw. (The diff itself does work: on 14 July, the day the method was built, four repeat pulls that same afternoon returned zero rows each, because everything on the page was already in the store.)"],cells:[{label:"The store",paths:[{path:"data/bidprime/seen-bids.json",size:"31,643 bytes · 700 ids"}],blocks:[`{
 "portal": "bidprime",
 "account": "aegisswarm",
 "updated_at": "2026-07-28T17:50:15.750912+00:00",
 "count": 700,
 "ids": [
 "2ca1c6bb-f3b5-4b8d-88db-b2d587c8bfc6",
 "76e68e67-55ad-4079-8e3a-0f4a1631e2e2",
 "802f51fb-c7cf-419f-a80e-df11c8f0280d", …`],notes:["7 daily archives × 100 rows = 700, and the 700 ids in the store are exactly those 700. The arithmetic is the finding."],tables:[]},{label:"The gate reads folder names, nothing else",paths:[],blocks:[],notes:['Cadence is 1 day. The gate asks only "is the newest folder at least a day old". It never opens the file, so a run that pulled nothing would still look healthy here. Note the four-day hole between 07-24 and 07-28. Those are the days the 700-id arithmetic is telling us about.'],tables:[[{header:!0,cells:["Daily folder","Holds","Size"]},{header:!1,cells:["2026-07-14","new-bids.json, 100 rows","395,597 B"]},{header:!1,cells:["2026-07-16","new-bids.json, 100 rows","596,038 B"]},{header:!1,cells:["2026-07-20","new-bids.json, 100 rows","397,349 B"]},{header:!1,cells:["2026-07-21","new-bids.json, 100 rows","387,427 B"]},{header:!1,cells:["2026-07-23","new-bids.json, 100 rows","357,840 B"]},{header:!1,cells:["2026-07-24","new-bids.json, 100 rows","387,437 B"]},{header:!1,cells:["2026-07-28","new-bids.json, 100 rows","385,735 B"]}]]}],notes:["Once the gate says yes, the orchestrator starts BidPrime first, at phase 0.6, ahead of every other portal batch. It is slow and it needs a login, so it gets a head start instead of being left to run on its own and rot."],then:"a real Chrome starts, hidden, on one local port"},{n:"1",title:"Open the door",who:"scripts/session_provider.py start --account aegisswarm --port 9223",summary:["A real Chrome, run with no window, on 127.0.0.1:9223, using a saved profile folder that keeps the login cookie between days. The automation attaches to it over the browser's own debug port.","This is the only stage in the whole flow that touches a paid account, and it is the reason every later stage is careful."],cells:[{label:"In",paths:[{path:"data/auth/bidprime.env",size:"354 bytes · email + password"},{path:"data/auth/profiles/aegisswarm/",size:"the saved Chrome profile, cookie lives here"}],blocks:[],notes:["Account is asjad@aegisswarm.com, a non-LGS trial. Member id 187452. Because it is disposable, the strict LGS-account rule does not gate it, but the pacing rules still do."],tables:[]},{label:"Out · and what it looks like the next morning",paths:[{path:"data/portals-pipeline/sessions/aegisswarm.json",size:"not on disk"}],blocks:[],notes:["The run id, 20260728-124957, is a plain timestamp minted at this moment. Every one of the seven files this run produced carries it in the name. It is the only thread tying them together.","The session record is written at start and removed at stop, so after a clean run it is gone. The folder's own timestamp is Jul 28 12:50, matching the run; the only file left in it belongs to a different portal. Absence here is the healthy state, not a gap."],tables:[]}],notes:[],then:"check we are still logged in before asking for anything"},{n:"2",title:"Preflight, and the login that did not have to run",who:"phase0_preflight.py → phase_login.py (only if needed)",summary:["Forces a proper 1280×900 window, opens the member inbox, and refuses to continue unless three things are true: no challenge page, no bounce to the login screen, and at least 20 rows actually drawn within 15 seconds.","The window size is not cosmetic. A background tab reports a height of zero, the grid then keeps only an 11-row buffer in the page, and the pull silently loses rows without failing."],cells:[{label:"What preflight reports",paths:[{path:"data/portals-pipeline/bp-aegisswarm-{run_id}-preflight-FAILED.json",size:null}],blocks:[`account · auth_mode · cookies_file_exists
browser_connected · viewport_forced
session_alive · logged_in
relogin_triggered · detection_clean`],notes:["The report goes to the screen, not to a file. A file is written only on failure:","There is no such file for any aegisswarm run. Three sit on disk, all from older accounts and the retired page-driving method: bp-towerex-preflight-FAILED.json (334 bytes, 18 May), bp-towerex-20260521-203007-preflight-FAILED.json (412 bytes, 21 May) and bp-bidprime-20260619-121519-preflight-FAILED.json (451 bytes, 19 June)."],tables:[]},{label:"The login step · did not run on this night",paths:[],blocks:[`bp-aegisswarm-20260714-085651-login.json 676 B
bp-aegisswarm-20260714-085957-login.json 159 B
bp-aegisswarm-20260714-090250-login.json 159 B
bp-aegisswarm-20260714-090831-login.json 159 B`],notes:[`The trap that made those four files. BidPrime's login box is a two-step React form. The normal typing helper types every character twice on it, which reads as "Invalid email or password" even with perfect credentials. The fix was to set the value the way React itself does. And if a challenge page ever appears, the run stops. We never solve one on this portal.`,"A login writes bp-aegisswarm-{run_id}-login.json. For 28 July there is none. The saved cookie held, which is the normal case and the quiet one.","The four login files that do exist are all from the day the new method was built:"],tables:[]}],notes:[],then:"one request, 100 notices, no clicking"},{n:"3",title:"The pull",who:"phase1_api.py · POST /api/v2/inbox/bid/list",summary:["Instead of driving the page, we send the same request the page sends: one page, 100 items, newest first. Each item already carries the notice body and often a named contact, so nothing is clicked and no detail page is opened.","Documents are left empty on purpose. The trial account meters downloads, so BidPrime is treated as a place to find bids, not to collect files. What we keep instead is the source link, and later stages fetch the real documents from the agency's own portal."],cells:[{label:"In → Out",paths:[{path:"POST https://www.bidprime.com/api/v2/inbox/bid/list",size:'page 1, pageSize 100, sort "issue desc"'},{path:"data/bidprime/daily/2026-07-28/new-bids.json",size:"385,735 bytes · 100 rows · 15 fields"},{path:"data/portals-pipeline/bp-aegisswarm-20260728-124957-new-bids.json",size:"385,735 bytes · same 100 rows"},{path:"data/portals-pipeline/bp-aegisswarm-20260728-124957-triage-input.json",size:"25,035 bytes · 100 rows · 6 fields"},{path:"data/bidprime/.current-run",size:"15 bytes · the bare string 20260728-124957"}],blocks:[],notes:['The runbook oversells the body text. data/bidprime/PORTAL.md:54 calls the description the "FULL RFP body (~3900 chars)". On this night the middle row had 1,970 characters, 8 rows had none, and the best bid of the night had 110. Sometimes it is the whole notice. Often it is a headline.'],tables:[[{header:!1,cells:["Distinct notice ids","100 of 100"]},{header:!1,cells:["Distinct titles","97. One title arrived twice, another arrived three times"]},{header:!1,cells:["States represented","38, including Canadian provinces"]},{header:!1,cells:["Body text length","shortest 0, middle 1,970, longest 28,469 characters"]},{header:!1,cells:["Rows with no body text at all","8"]},{header:!1,cells:["Rows carrying a contact email","23"]},{header:!1,cells:["Rows carrying documents","0, by policy"]}]]},{label:"Real record Bid A",paths:[],blocks:[`{
 "bid_id": "9d4d6921-5641-4bc5-8848-9acafebf208a",
 "title": "RFP - Street Tree Planting Services",
 "buyer": "Village of Greenville - Parks,
 Recreation and Forestry Department",
 "state": "WI",
 "due_date": "2026-08-14",
 "issue_date": "2026-07-28T14:47:28.000Z",
 "detail_url": "https://www.bidprime.com/api/v2/
 bid/link/source/9d4d6921-5641-…",
 "description": "Village of Greenville Parks,
 Recreation and Forestry Department REQUEST FOR
 PROPOSALS PLANTING OF STREET TREES…",
 "contact": {"name": "", "phone": "", "email": ""},
 "documents": [],
 "setaside": "",
 "flag": 0,
 "publisher": {
 "uuid": "43a60686-336a-11eb-be72-02515b21f92a",
 "name": "Green Bay Press Gazette", …},
 "status": "open",
 "source_portal": "bidprime"
}`,`{
 "bid_id": "fa74010e-2adf-46a5-9be0-3580fc8c94d1",
 "title": "RFP - Street Tree Planting Services",
 "buyer": "Village of Greenville Parks - Parks,
 Recreation and Forestry Department",
 "issue_date": "2026-07-28T11:03:23.000Z",
 "publisher": {"name": "Wisconsin Public Notices", …}
}`],notes:["Word-for-word the same notice body. Two newspapers republished it, so BidPrime issued two ids, and the buyer name differs by one word. The memory at stage 0 keys on the id, so it can never collapse these. Both were pulled, both were triaged, both cost money."],tables:[]}],notes:["Three hard walls sit at this stage. The page size is capped at 100 by the server. Asking for 250 or 500 still returns 100. And 100 is also the largest the real dropdown offers, so going deeper would not look like a person. The inbox held 4,122 active bids when it was last measured on 14 July, and that backlog is never walked. And the buyer name is often the republisher, not the agency that issued the work."],then:"the account is put down immediately"},{n:"4",title:"Close the door",who:"scripts/session_provider.py stop --account aegisswarm",summary:["Chrome is killed the moment the pull returns. Nothing after this point touches BidPrime at all: not the triage, not the judging, not the publish. The whole authenticated window is one short visit, once a day.","That is the entire detection story for this portal. One login. One request. Out."],cells:[{label:"Evidence it happened",paths:[{path:"data/portals-pipeline/sessions/",size:"folder timestamp Jul 28 12:50 · aegisswarm.json absent"}],blocks:[],notes:["The session file was written at start and deleted at stop. Only opengov.json (329 bytes, 14 July) is still sitting there, which is a different portal's leftover."],tables:[]}],notes:[],then:"100 titles go to the first AI read"},{n:"5",title:"Triage: the cheap first read",who:"max-triage · AI agent → bp-aegisswarm-20260728-124957-triage-decisions.json",summary:["Every new bid gets six fields sent to an agent: id, title, buyer, state, due date, and its position in the file. No body text. The agent answers OPEN or SKIP with a short reason.","There is no keyword filter in front of this. All 100 are read. 86 came back SKIP, 14 came back OPEN."],cells:[{label:"In → Out",paths:[{path:"…-triage-input.json",size:"25,035 bytes · 100 rows"},{path:"…-triage-decisions.json",size:"8,354 bytes · 100 rows · 86 SKIP / 14 OPEN"}],blocks:[`{
 "idx": 9,
 "bid_id": "9d4d6921-5641-4bc5-8848-9acafebf208a",
 "title": "RFP - Street Tree Planting Services",
 "buyer": "Village of Greenville - Parks,
 Recreation and Forestry Department",
 "state": "WI",
 "due_date": "2026-08-14"
}`],notes:["No script writes this file. An agent does. So there is no line of code to point at as proof it was written. The proof is the next step, which refuses to run without it. If the agent writes nothing, the run stops with a missing-file error rather than quietly shipping zero bids."],tables:[]},{label:"Real decisions Bid A · rejectedBid B · opened",paths:[],blocks:[`{
 "idx": 9,
 "decision": "SKIP",
 "reason": "tree planting alone, no removal"
}`,`{
 "idx": 60,
 "decision": "OPEN",
 "reason": "Cat 4 on-call tree trimming
 and removal"
}`,`0 Palm Aire Landscape Enhancements
 → landscape enhancements, not LGS trade
6 161110 - Sweeping Services, Loudoun County
 → street sweeping, wrong vertical
23 In-Channel Vegetation Disking
 → disking is tillage, not clearing
22 Target Pond Improvements
 → pond improvements is Cat 6 adjacent, not Cat 1-5`],notes:['Both bids say "tree" in the title. One is planting new trees, which LGS does not do; the other is on-call removal, which is the middle of its work. A keyword filter would have kept both or dropped both.'],tables:[]}],notes:[],then:"the 14 survivors get their body text attached"},{n:"6",title:"Build the second-read packet",who:"python run_bidprime_sweep.py prep-judge",summary:["Keeps only the OPEN rows and glues each one's body text back on, capped at 6,000 characters. This is a pure file join. Nothing goes to the internet.","Bid A's journey ends before this file. Its whole cost was one title read."],cells:[{label:"In → Out",paths:[{path:"data/bidprime/.current-run",size:"tells it which run to join"},{path:"…-new-bids.json + …-triage-decisions.json",size:null},{path:"…-judge-input.json",size:"14,394 bytes · 14 rows"}],blocks:[],notes:["The pointer file is load-bearing and unchecked. .current-run is a 15-byte file holding one timestamp. Both this step and the publish step read it to decide which run they are working on. Nothing checks that it is fresh. A stale pointer would make the publish quietly ship an old night's verdicts as today's."],tables:[]},{label:"Real record Bid B",paths:[],blocks:[`{
 "idx": 60,
 "title": "On-Call Tree Trimming, Removal &
 Stump Grinding Services",
 "buyer": "Lexington County",
 "state": "SC",
 "due_date": "2026-08-17",
 "description": "On-Call Tree Trimming, Removal
 &
 Stump Grinding Services
 *Solicitation available on July 28, 2026 at
 10am EST*",
 "source_url": "https://www.bidprime.com/api/v2/
 bid/link/source/3ec68ab2-94c8-48b2-ad50-…"
}`],notes:["110 characters. The best bid of the night arrives at the judge with almost nothing to read, because the county only released the packet that same morning. Watch what the judge does with that."],tables:[]}],notes:[],then:"14 bids are scored against what LGS actually wins"},{n:"7",title:"The judge",who:"max-bid-judge · AI agent → bp-aegisswarm-20260728-124957-verdicts.json",summary:["Yes, maybe or no, a score out of 100, a category, the reasoning, and two lists: what fits and what worries. That night: 12 yes, 1 maybe, 1 no."],cells:[{label:"Out",paths:[{path:"…-verdicts.json",size:"23,688 bytes · 14 rows"}],blocks:[` 94 TX Disaster Recovery Services
 93 TX Local Let Maintenance Contract, Starr Co, Tree Trimmin…
 88 SC On-Call Tree Trimming, Removal & Stump Grinding Servic…
 86 SC *On Call Tree Removal Greenville
 84 WA RFP - Clearview Circuit 12-584, Transmission & Distrib…
 84 NM RFP - Statewide On-Call Integrated Vegetation Manageme…
 76 NB Right-of-Way Brush MaintenanceSaint John to St Stephen
 76 NB Right-of-Way Brush Maintenance Fredericton to Norton
 70 ON 2026-292t - Tree Trimming and Removal Services for the…
 66 GA IFB/GS/DPW/2605-1260212-2/Yard Debris Processing, Haul…
 62 TX Citywide Public Works General Services
 62 LA Debris Removal - Cd Rehab
 48 OR On-Call Vegetation Control maybe
 28 YT RFB-2026-7-5467 - Highway Right of Way Vegetation Cont… no`],notes:['Two of the twelve look like the same job and are not. The two New Brunswick Power brush contracts scored identically, and the judge said so in writing on the second one: "Same shape as idx 97 and scored identically." They are two separate stretches of line, not a duplicate.',`Titles are verbatim, cut with a … where they ran long. The two New Brunswick Power lines show the portal's raw text as it really is: one is missing the space after "Maintenance", the other has two. That is not a typo on this page, it is what came out of the inbox.`],tables:[]},{label:"Real record Bid B · YES, 88",paths:[],blocks:[`{
 "idx": 60,
 "title": "On-Call Tree Trimming, Removal &
 Stump Grinding Services",
 "buyer": "Lexington County",
 "state": "SC",
 "would_lgs_bid": "yes",
 "score": 88,
 "category": "Category 4 - City/County annual
 tree maintenance contract",
 "primary_reason": "Verbatim Category 4 title -
 on-call countywide tree trimming, removal and
 stump grinding - from a county buyer in South
 Carolina, a state with 33 prior LGS submissions.
 The on-call qualifier puts it above the
 operational floor. The description is a
 placeholder because the solicitation only
 released the morning of 7/28/2026, so the packet
 has to be pulled, but a strong title is not
 punished for portal metadata.",
 "service_match": "core",
 "scale_match": "above_floor",
 "buyer_match": "core",
 "red_flags": ["thin_description_pull_rfp_packet"],
 "fit_signals": [
 "on_call_countywide_scope",
 "tree_trimming_removal_stump_grinding",
 "county_buyer_core_type",
 "SC_active_state_33_prior_submissions"
 ],
 "elaboration": "Solicitation was scheduled to go
 live 7/28/2026 at 10am EST - pull the packet
 immediately, due 8/17/2026 leaves a short
 window…",
 "kansas_city_risk": false,
 "closed_award": false
}`],notes:["The judge saw that the text was thin, said why it was thin, flagged it, and scored the title anyway. That flag is worth remembering. Three stages from now it disappears."],tables:[]}],notes:[],then:"three files become two, in the shape the next tool wants"},{n:"8",title:"Compile",who:"python compile_api.py",summary:["Joins the bids, the triage answers and the verdicts into two files: one record per OPEN bid, and one tidied verdict per judged bid. The contact object is split into a plain email and a plain phone, and the body text is renamed detail_text.","This is where BidPrime's own work ends. Everything after belongs to the shared machinery."],cells:[{label:"Out",paths:[{path:"…-captures.json",size:"24,930 bytes · 14 entries, keyed by row position"},{path:"…-verdicts-compiled.json",size:"15,621 bytes · 14 rows"}],blocks:[],notes:['A field with the wrong name. The capture writes "buyer_state": "Lexington County". It sounds like it holds a buyer and a state; it holds only the buyer. The reader downstream splits it on a comma and takes the first piece, which is harmless here and would be wrong the moment a buyer name contains a comma.',"The docs policy, written into the data. documents is always [] and download_url is always null. Both links point at the same BidPrime redirect, which is what later enrichment follows to reach the agency's real site."],tables:[]},{label:'Real record Bid B · captures["60"]',paths:[],blocks:[`{
 "input": {
 "title": "On-Call Tree Trimming, Removal &
 Stump Grinding Services",
 "buyer": "Lexington County",
 "state": "SC",
 "due_date": "2026-08-17",
 "row_id": "3ec68ab2-94c8-48b2-ad50-f306c395e0e4",
 "solicitation_id": "3ec68ab2-94c8-48b2-ad50-…"
 },
 "capture": {
 "bid_id": "3ec68ab2-94c8-48b2-ad50-f306c395e0e4",
 "title" and "solicitation_id" omitted here …
 "buyer_state": "Lexington County",
 "issued": "2026-07-28T05:12:27.000Z",
 "due_date": "2026-08-17",
 "detail_text": "On-Call Tree Trimming, Removal
 &
 Stump Grinding Services
 *Solicitation available on July 28, 2026 at
 10am EST*",
 "view_url": "https://www.bidprime.com/api/v2/
 bid/link/source/3ec68ab2-…",
 "source_url": "https://www.bidprime.com/api/v2/
 bid/link/source/3ec68ab2-…",
 "download_url": null,
 "documents": [],
 "contact_email": "lhardy@lexingtoncounty.sc.gov",
 "contact_phone": "803-785-8319",
 "auto_tag": ""
 }
}`],notes:["The notice id is used for three different fields, row_id, solicitation_id and bid_id, because BidPrime never gives us a real solicitation number."],tables:[]}],notes:[],then:"the YES bids are copied into the shared card file, and lose things on the way"},{n:"9",title:"Into the shared card file",who:"scripts/dump_yes_for_portalpro.py → build_yes_excel.load_bidprime_yes()",summary:["The loader finds the newest compiled verdicts file, keeps only the YES rows, pairs each one with its capture, and writes them into the fixture next to every other portal's cards.","Twelve BidPrime cards went in, out of 1,470 total. This is the single most lossy stage in the whole flow, and none of the loss is announced."],cells:[{label:"In → Out",paths:[{path:"data/portals-pipeline/bp-*-verdicts-compiled.json",size:"newest by name · picks bp-aegisswarm-20260728-124957"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"2,153,413 bytes · 1,470 cards · 12 bidprime"}],blocks:[],notes:["Why the text vanishes. The loader has two branches. If the body text is 200 characters or longer it is used as-is. If it is shorter, the code assumes it is looking at the old scraped-page format, which was navigation junk, and builds a replacement out of attachment names and the contact. Bid B's real 110-character notice falls into that second branch and is thrown away. The branch was written for a format this portal stopped producing on 14 July.",`The date is a lie by hardcode. dump_yes_for_portalpro.py:371 sets last_run["bidprime"] = "2026-05-20". The fixture on disk was generated 2026-07-28T22:38:01+00:00 and still reports BidPrime's last run as 20 May.`],tables:[[{header:!0,cells:["Thing","What happened"]},{header:!1,cells:["12 YES verdicts","all 12 became cards"]},{header:!1,cells:["1 MAYBE verdict","dropped silently"]},{header:!1,cells:["Red flags on the verdicts","11 of 12 had them · 0 arrived"]},{header:!1,cells:["Fit signals on the verdicts","12 of 12 had them · 0 arrived"]},{header:!1,cells:["The portal's own body text","only 4 of 12 cards carry it"]},{header:!1,cells:["3 cards","description replaced by a contact line"]},{header:!1,cells:["5 cards","description replaced by the judge's own reasoning"]}]]},{label:"Real card Bid B on the board",paths:[],blocks:[`{
 "id": "13f0825daac862a3",
 "portal": "bidprime",
 "portal_label": "BidPrime (aegisswarm)",
 "source_bid_id": "3ec68ab2-94c8-48b2-ad50-f306c395e0e4",
 "title": "On-Call Tree Trimming, Removal &
 Stump Grinding Services",
 "buyer": "Lexington County",
 "state": "SC",
 "solicitation_no": null,
 "federal": false,
 "score": 88,
 "verdict": "yes",
 "category": "Category 4 - City/County annual
 tree maintenance contract",
 "ai_reasoning": "Verbatim Category 4 title - on-call
 countywide tree trimming, removal and stump
 grinding - from a county buyer in South Carolina,
 a state with 33 prior LGS submissions. The on-call
 qualifier puts it above the operational floor. The
 description is a placeholder because the
 solicitation only released the morning of
 7/28/2026, so the packet has to be pulled, but a
 strong title is not punished for por",
 "description": "Contact: lhardy@lexingtoncounty.sc.gov
 / 803-785-8319.",
 "due_date": "2026-08-17",
 "source_url": "https://www.bidprime.com/api/v2/
 bid/link/source/3ec68ab2-…",
 "contact_name": null,
 "contact_email": "lhardy@lexingtoncounty.sc.gov",
 "contact_phone": "803-785-8319",
 "red_flags": [],
 "fit_signals": [],
 "first_seen": "2026-07-28",
 "last_seen": null,
 "has_documents": true
}`,`{
 "idx": 87,
 "title": "On-Call Vegetation Control",
 "buyer": "Oregon Youth Authority",
 "state": "OR",
 "would_lgs_bid": "maybe",
 "score": 48,
 "primary_reason": "'On-Call Vegetation Control' with
 no description is genuinely ambiguous about what
 the work is - it could be ROW-scale brush clearing
 or it could be weed and grass control on the
 grounds of one youth correctional facility. The
 buyer type points hard at the second: a youth
 corrections agency is a single-institution grounds
 buyer, which is a named below-floor non-fit. The
 on-call qualifier is the only thing keeping this
 off a straight no. Pull the packet before spending
 anything on it.",
 "red_flags": [
 "thin_description_pull_rfp_packet",
 "low_scale_inferred_single_site",
 "single_facility_grounds_scope_inferred_
 from_buyer",
 "vegetation_control_may_mean_herbicide_
 or_mowing",
 "out_of_core_state"
 ]
}`],notes:['The description is now a contact line. The red flag the judge wrote is gone. The reasoning is chopped at 400 characters, which lands mid-word on "por". The contact name is null even though the pull captured "Linsey Hardy". And solicitation_no is null, because BidPrime never gives us one.',`The judge asked for a human to pull the packet. Nobody was ever shown the card. The sweep's own description claims it "publishes YES+MAYBE"; the loader keeps only yes.`],tables:[]}],notes:["The stage model is out of date here. docs/portal-dataflow/bidprime.md:291 says the fixture holds exactly 9 BidPrime rows from the 24 July run. The file on disk holds 12, all from 28 July. The model doc was written before this run existed and does not mention 28 July anywhere. The file wins.","A trap that is loaded but not fired. The loader picks its input by sorting file names alphabetically, not by date. Every live file starts bp-aegisswarm-. The documented fallback account starts bp-towerex-, which sorts after it no matter what date it carries. There are 89 bp-towerex-* files sitting in that folder right now, but none of them is a -verdicts-compiled.json, so the glob still returns the right file. Checked today: it picks bp-aegisswarm-20260728-124957. One towerex compiled file would freeze the board on May."],then:"the shared machinery takes over, starting with a step that skips this portal"},{n:"10",title:"Carry forward: this portal is not in it",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:[`On most portals this is a safety net: a bid that fell out of tonight's pull keeps yesterday's verdict instead of vanishing. The registry decides who is in. BidPrime's entry says carry_forward: "engine-internal", and the --all run only touches portals marked "orchestrator". So this script never runs on BidPrime.`,"In plain terms: no, BidPrime is not in the shared carry-forward, and that is correct. There is no verdicts file anywhere under data/bidprime/ to carry forward. The only file that folder keeps is new-bids.json."],cells:[{label:"What BidPrime does instead",paths:[],blocks:[],notes:['The label is wrong even though the outcome is right. "engine-internal" says the engine carries verdicts forward by itself. Nothing in this sweep carries a verdict anywhere. What the label actually achieves is "phase 2.5 leaves me alone", which is the right result. "none" would describe the code honestly.'],tables:[[{header:!1,cells:["A permanent id store","seen-bids.json. A notice is triaged once in its life, so there is no verdict to lose"]},{header:!1,cells:["A merge-on-write daily file","re-running the same day merges by notice id, so a second run finding nothing never wipes the day"]}]]}],notes:[],then:"every file-based operator board reads a file this portal never writes"},{n:"11",title:"The boards that show zero",who:"2.6 portals_cumulative.py · 2.7 daily report · 2.8 build_portal_metrics.py · 2.9 build_monitor_html.py",summary:["Four operator boards are built from the daily folders. Each one wants stats.json, verdicts.json or report.md inside data/bidprime/daily/{date}/. BidPrime writes only new-bids.json.","So a night that found 12 real YES bids reads as nothing on every one of them."],cells:[{label:"Read off disk today",paths:[],blocks:[`{
 "slug": "bidprime",
 "label": "BidPrime (aegisswarm)",
 "state": "",
 "core": false,
 "baseline": null,
 "baseline_date": null,
 "latest_snapshot": null,
 "totals": {},
 "active": false
}`],notes:["This is a reporting gap, not a data gap. The 12 bids are real, they are on the live board, and they count in the scorecard at stage 14. The zeros are what happens when a portal that keeps its work in a shared folder is measured by a tool that only looks in its own folder."],tables:[[{header:!0,cells:["Board","What it says about bidprime"]},{header:!1,cells:["data/portals/cumulative-yes.md","the row reads | bidprime | 0 |, forever, even though the registry marks it as counting"]},{header:!1,cells:["data/portals/metrics.json",'{"totals": {}, "active": false, "latest_snapshot": null, "baseline": null}']},{header:!1,cells:["data/portals/monitor.html","blank row, built from the same empty metrics entry"]},{header:!1,cells:["the standardized daily report","never written. There is no report.md in any bidprime daily folder"]},{header:!1,cells:["the phase 4 roll-up","marks the portal FAILED, because it looks for the files above"]}]]}],notes:[],then:"bids stop being BidPrime-shaped here"},{n:"12",title:"Publish, cluster, dedupe",who:"2.85 · scripts/publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["The cards are pushed into the shared database and grouped with every other portal's bids by cleaned-up title plus state, and by solicitation number plus state. Pairs the rules cannot settle go to a judging agent, and confirmed matches collapse into one group.","BidPrime is marked an aggregator. When a group also holds a bid from the agency's own portal, that portal's buyer name wins the label, because BidPrime's is often the newspaper that reprinted the notice."],cells:[{label:"This is the stage that earns its keep, and the stage that can get it wrong",paths:[],blocks:[`-- due 2026-08-17 · the live one -----------
demandstar 544211 90 sol none
scbo 67651 90 sol 2027-RFPQ-05
napc 262535b9c271b3b1 88 sol none no due date
bidprime 3ec68ab2-94c8-… 88 sol none

-- due 2026-07-22 · already closed --------
bidnet 444086840578 86 sol 444086840578
scbo 67033 85 sol 2027-RFPQ-03
demandstar 541522 85 sol none
ionwave lexingtoncounty: 82 sol none
 2027-RFPQ-03`],notes:["Bid B's exact title appears eight times in the fixture, from six portals. But it is not one job. It is two, and the only things that say so are the due date and the solicitation number:",'Lexington County ran the same contract twice with a word-for-word identical title. Grouping on cleaned title plus state alone would fold all eight into one and put a closed July solicitation on the same card as the live August one. BidPrime hands over no solicitation number at all. Its solicitation_no is null, so its row carries only the due date to tell the two apart. BidNet supplied neither a real number (it reused its own row id) nor the right buyer name ("Unknown South Carolina public agency").'],tables:[]},{label:"Where the rows land",paths:[{path:"supabase.bids",size:"upsert on (portal_key, source_bid_id)"},{path:"supabase.clusters",size:"upsert, then bids patched with the cluster id"},{path:"supabase.sweep_runs",size:"upsert on (portal_key, run_date)"},{path:"supabase.dedup_adjudications",size:"the judge's durable same/not-same answers"}],blocks:[],notes:["BidPrime's presence on the live board is a one-night window. The loader at stage 9 reads a single run's file, so yesterday's YES bids are not in today's fixture. The publish then deletes any live row of a listed portal that is missing from today's fixture. Checked on disk: all 12 BidPrime cards in the fixture come from the 28 July run, and none of the 24 July run's 9 cards survive in it. Whether that is deliberate ageing or quiet daily loss is still an open question; every other portal loads an accumulating file.","Importing this script used to publish and delete. It no longer does. The whole body was moved into main() behind an entry guard on 27 July (publish_to_supabase.py:1247), and tests/test_publish_import_safety.py holds it there. The same warning is still live one stage back, though. dump_yes_for_portalpro.py has no entry guard at all: 13 statements and four loops run in the module body, so importing that one still rebuilds the fixture (docs/tickets-pipeline-hardening.md:178)."],tables:[]}],notes:[],then:"the shared machinery goes and gets what BidPrime deliberately did not"},{n:"13",title:"Documents, requirements, and a second look at duplicates",who:"2.85 run_enrichment_phase.py · 2.87 extract_doc_text.py → build_bidpack.py → requirements-extractor → apply_requirements.py · 2.875 dedup re-pass",summary:["Enrichment fills in missing descriptions, contacts and documents on the grouped bids. BidPrime has no enrichment pass of its own. Its registry enrich_passes is empty and no pass in the enrichment script names it. Its bids get documents only when their group also holds a bid from a portal we can download from.","This is the docs policy paying off, or not paying off, depending on the bid."],cells:[{label:"How it actually went for the 12 cards",paths:[],blocks:[],notes:[`Whose twin, though. This one does not add up. The paperclip is a group-level flag: a card shows documents when any bid in its group has one. The two other copies of the live 17 August solicitation, scbo 67651 and demandstar 544211, both show no documents. All four copies of the closed 22 July one do. (The eighth card, napc, carries no due date at all, so it cannot be placed on either solicitation.) So whatever group BidPrime's August card sits in, it is provably not the group holding the live South Carolina copy, and the only documented neighbours in this family are the July ones. That reads like the mis-grouping stage 12 warns about, already on the board. It stops at "reads like": group ids live only in the database, and the key on this machine returns no rows, so this is the strongest claim the files support and no stronger.`,"Bid B is one of the two. It has no documents from BidPrime and never will, so the files come from another card in its group. The trade works when there is a twin. A BidPrime-only group has no documents at all."],tables:[[{header:!1,cells:["Cards that ended up with documents","2 of 12"]},{header:!1,cells:["Documents BidPrime itself supplied","0. The pull always writes an empty list"]}]]},{label:"Requirements and the second dedup",paths:[{path:"data/portals/requirements-manifest.json → requirements-output.json → supabase.bid_requirements",size:null},{path:"data/bidpacks/{pack_key}/",size:"BID.md + page-*.md + requirements.md + docs/*.md"},{path:"data/bidpacks/packs-index.json",size:null}],blocks:[],notes:["Why the second dedup matters more here than elsewhere. Enrichment fills in blank buyers and due dates, which makes pairs comparable that were not comparable before. BidPrime's buyer field is often the republisher, so its bids are exactly the ones that could not be matched on the first pass. Bid A's twin at row 18 is the shape of the problem: same notice, two ids, buyer names one word apart.","Requirements are picked by group, not by portal, so BidPrime groups are included automatically. A group with nothing to read gets a neutral row rather than a blank, so the board never claims a bid is still being processed when it is not.","One readable folder per group, built from the database and the document store. Keyed by group, so a BidPrime group gets a pack like any other, filled with whatever its twins supplied."],tables:[]}],notes:[],then:"what changed, who gets told, and the one count that includes this portal"},{n:"14",title:"Watch, mail, and the honest count",who:"2.88 bid_watch.py · new_bids_email.py · alerts_engine.py · sentinel · 4.99 scorecard.py",summary:["The day's new groups and any changes on tracked bids become emails. BidPrime's bids reach these the same way everyone's do, through the groups table."],cells:[{label:"Watch and digests",paths:[],blocks:[],notes:[],tables:[[{header:!1,cells:["Source-page re-capture",'off. Registry watch: "none". We do not go back to BidPrime to see if a notice changed.']},{header:!1,cells:["Pipeline-diff watch","on. Changes to the published rows are still noticed"]},{header:!1,cells:["daily-new-bids.md, daily-watch-digest.md, daily-alerts.md","written, but sending is a silent no-op until an email key is set in data/auth/resend.env"]},{header:!1,cells:["Sentinel","checks each portal completed each phase and writes sentinel.json"]}]]},{label:"4.99 · the one board where BidPrime is not zero",paths:[{path:"scripts/scorecard.py {today} → data/portals/scorecard.csv",size:null}],blocks:[],notes:["If two numbers for this portal ever disagree, the scorecard is the one to believe. The zeros elsewhere are an artifact of where the files live.","The scorecard counts out of the database, not out of per-portal files. BidPrime's 12 YES bids are real rows in bids, so they are inside these totals even though the four file-based boards at stage 11 all show nothing."],tables:[]}],notes:[],then:"the operator sees a card"},{n:"15",title:"The board",who:"END · PortalPro / shessi.dev/lgs",summary:["The app reads the database live; the fixture file is the offline fallback. Bid B appears as one card, labelled Lexington County, due 17 August, with a contact and with documents borrowed from a neighbour in its group. Eight cards in the fixture carry that exact title, but they are not one group: the paperclip flags at stage 13 prove at least two, and BidPrime's card is not in the one holding the live South Carolina copy.","What the operator does not see on that card: the judge's flag saying the packet still needs pulling, and the county's own one-line notice. Both existed three files earlier."],cells:[{label:"One more frozen artifact, unrelated to the live path",paths:[],blocks:[],notes:["PortalPro also ships a demo fixture pair, PortalPro/src/fixtures/captures.json and verdicts.json, last touched 26 May, with keys like p1_r1 from the retired grid-scraping era. Both are still imported by normalize.ts:2-3. Together with the hardcoded 20 May run date at stage 9 that is two separate things in the app frozen in May, both real, neither connected to the nightly flow above."],tables:[]}],notes:[],then:null}],d=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["7 daily archives, 700 remembered ids, never one repeat","no daily run has ever stopped early, so every one hit the 100 cap and the tail was lost. Bids published between runs and pushed past position 100 were never seen and cannot be recovered."]},{header:!1,cells:["The page size is capped at 100 by the server","asking for 250 or 500 returns 100; the 4,122-bid backlog is never walked. Depth is not a setting we can turn up."]},{header:!1,cells:["Documents are never pulled, on purpose","the trial account meters downloads, so we keep the source link instead. Only 2 of the 12 cards ended up with documents, and both got them from another card in their group. For Bid B that neighbour cannot be the live South Carolina copy (see stage 13)."]},{header:!1,cells:["One solicitation, several notice ids","two newspapers reprinted the Greenville tree-planting RFP, so it arrived twice in one page with different ids and buyer names one word apart. The id-based memory can never collapse them; only the cross-portal dedup can."]},{header:!1,cells:["The buyer field is often the republisher","handled downstream by demoting BidPrime's label when a direct portal is in the same group, not fixed at the pull."]},{header:!1,cells:["No solicitation number, ever","the notice id is copied into three fields and solicitation_no lands null on the board. That removes the second of the two clustering rules, so a BidPrime bid can only be grouped by title and state. Lexington County ran the same title twice this summer: one closed 22 July, one live to 17 August, and the due date is all that keeps BidPrime's copy on the right one."]},{header:!1,cells:["MAYBE verdicts never reach the board","the loader keeps only yes, while the sweep's own description says it publishes YES and MAYBE. Every MAYBE this portal has ever produced was dropped, including a 48-score bid the judge explicitly asked a human to look at."]},{header:!1,cells:["Short notices lose their text entirely","body text under 200 characters hits a branch written for the retired scraping format and is replaced by a contact line, or by the judge's own reasoning. 8 of 12 cards that night do not carry the portal's real words."]},{header:!1,cells:["Red flags and fit signals are dropped at the fixture","11 of 12 YES verdicts carried red flags and 12 of 12 carried fit signals. Zero arrived on the board. The loader simply does not copy those fields."]},{header:!1,cells:["Live board presence is a rolling one-run window","the loader reads one run's file, then the publish deletes any live row missing from today's fixture. Yesterday's YES bids are removed. Every other portal loads an accumulating file."]},{header:!1,cells:["Registry says it counts; every file-based board says zero","in_cumulative: true, but cumulative-yes.md reads | bidprime | 0 |, metrics has {totals:{}, active:false}, monitor is blank and the roll-up says FAILED, all because those readers want files this portal does not write."]},{header:!1,cells:['carry_forward: "engine-internal" is a misnomer',"nothing carries verdicts forward; there is no verdicts file under data/bidprime/ at all. The label achieves the right outcome (phase 2.5 skips it) for a stated reason that is not true."]},{header:!1,cells:["The fixture loader sorts file names, not dates","latent, not firing. 89 bp-towerex-* files sit in the pipeline folder; none is a compiled-verdicts file, so the glob still returns the right one. Checked today. A single towerex compiled file would freeze the board on May."]},{header:!1,cells:[".current-run has no freshness check","a 15-byte pointer decides which run the prep and publish steps work on. Stale pointer, wrong night shipped, no warning."]},{header:!1,cells:["buyer_state holds only the buyer","the reader splits it on a comma and takes the first piece. Fine today, wrong the first time a buyer name contains a comma."]},{header:!1,cells:["202 bp-* files and nothing prunes them","68 from the live account, 89 from the retired towerex era, 45 older experiments, all sitting in the shared data/portals-pipeline/ folder, which is also why the automatic inspector cannot see this portal's run at all."]},{header:!1,cells:["The runbook oversells the body text",'PORTAL.md:54 says "FULL RFP body (~3900 chars)". Measured on this run: middle 1,970, 8 rows with none, and the top-scoring bid had 110.']},{header:!1,cells:["A challenge page is a hard stop","we never solve one on this portal. The run ends and the account is left alone."]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026, run id 20260728-124957. Every record above was read from the named file on disk; every count traces to a row count, a byte size or an ls. Because this portal writes no stats.json, no funnel number came from a stats file. Each one was counted out of the run files named in the funnel note. Baseline map: docs/portal-dataflow/bidprime.md (evidence-cited to file:line), which predates this run and is stale on the fixture row count. Runbook: data/bidprime/PORTAL.md. Companion pages: Portal pedia · 02 (DemandStar), which found the very same Lexington County bid on the very same night."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026, run id 20260728-124957. Every record above was read from the named file on disk; every count traces to a row count, a byte size or an ls. Because this portal writes no stats.json, no funnel number came from a stats file. Each one was counted out of the run files named in the funnel note. Baseline map: docs/portal-dataflow/bidprime.md (evidence-cited to file:line), which predates this run and is stale on the fixture row count. Runbook: data/bidprime/PORTAL.md. Companion pages: Portal pedia · 02 (DemandStar), which found the very same Lexington County bid on the very same night.",c="docs/portal-dataflow/pedia-bidprime.html",p={slug:e,title:t,eyebrow:a,headline:s,lede:n,funnel:i,funnel_note:o,legend:r,stages:l,sections:d,footer:h,source_page:c};export{p as default,a as eyebrow,h as footer,i as funnel,o as funnel_note,s as headline,n as lede,r as legend,d as sections,e as slug,c as source_page,l as stages,t as title};
