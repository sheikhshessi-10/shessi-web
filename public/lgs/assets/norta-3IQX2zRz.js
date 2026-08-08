const e="norta",t="New Orleans RTA: what happens to a bid, stage by stage",s="Portal pedia · 33",a="New Orleans RTA: a six-minute crawl that ends in eight NOs",n="Every stage of the run of 28 July 2026, with a real record from the actual files at each step. Two bids are followed the whole way. Neither reaches the board, because nothing did: the judge scored all eight open bids NO, the highest at 8 out of 100. That is the honest headline for this portal, and it is not a one-off.",o=[{value:"147",label:"raw grid rows"},{value:"8",label:"still open"},{value:"3",label:"carried over"},{value:"5",label:"new tonight"},{value:"8",label:"triage says open"},{value:"0",label:"yes"},{value:"0",label:"maybe"},{value:"8",label:"no"}],r=`Every count except the first comes from data/norta/daily/2026-07-28/stats.json (396 bytes). The 147 raw rows come from data/norta/bids/index.json (raw_rows), matching the pull log line "filtered to OPEN status: 8 bids (from 147 raw rows)". This portal's stats file has no triage.skip key at all, so no skip cell is shown. One number will look wrong later on this page and is not. stats.json says 8 NO, but daily/2026-07-28/verdicts.json holds 24 rows and the day's report says "0 YES / 0 MAYBE / 24 NO". Both are true: compile counts only tonight's judge file, then the shared carry-forward step appends 16 older verdicts to the same file after stats was already written. Stage 8 and stage 9 show it happening.`,i=["Bid A · RFQ RTAR_03915 · Instructional Design and Development Streetcar Curriculum. New tonight. Ends NO, score 6.","Bid B · IFB 2026-019 · Replace Trolley Lift Cable. Already decided on a prior night, re-judged anyway. Ends NO, score 8, the night's high."],l=[{n:"1",title:"Is this portal even due today?",who:"scripts/portal_due.py --batch portals",summary:["NORTA runs on a three-day beat, not nightly. The gate looks at the newest dated folder under data/norta/daily/. Three or more days old means run it. Otherwise the portal is skipped and nothing is lost, because every later stage compares against the last archived day, whenever that was.","The number the gate uses is the live one from the shared portal table when that answers; the file below is only the cold-start fallback."],cells:[{label:"In",paths:[{path:"data/portals/registry.json",size:"the norta entry"},{path:"data/norta/daily/*",size:"39 dated folders on disk"}],blocks:[],notes:[],tables:[]},{label:"The registry entry, verbatim",paths:[],blocks:[`{
 "slug": "norta",
 "label": "New Orleans RTA",
 "engine": "",
 "batch": "portals",
 "cadence_days": 3,
 "authed": false,
 "enrich_passes": [],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "orchestrator"
}`],notes:["The prior archived folder is 2026-07-23. Five days. Due."],tables:[]}],notes:[],then:"the slug is printed, and a child agent picks it up"},{n:"2",title:"The handoff",who:"Agent(general-purpose) reading ../.claude/skills/norta-sweep/SKILL.md",summary:["NORTA has no single run script. A child agent is handed the runbook and runs three Python files by hand, with the judging step wedged between the second and the third. That agent owns everything through stage 8.","It runs in parallel with the other portals in its batch. If it dies, the run is marked failed for this portal only and the rest carry on."],cells:[{label:"The three scripts that exist for this portal",paths:[{path:"data/norta/scripts/pull_bids.py",size:null},{path:"data/norta/scripts/prep_bids.py",size:null},{path:"data/norta/scripts/compile_insights.py",size:null}],blocks:[],notes:[],tables:[]},{label:null,paths:[],blocks:[],notes:["This one is not on the foreground list, and it should probably be. The pull opens a real browser window and took 356.1 seconds on this run. The batch rules name three portals as heavy pulls — bidnet, nc-evp and ionwave — and this is not one of them."],tables:[]}],notes:[],then:"a real Chromium window opens, parked off the edge of the screen"},{n:"3",title:"Pull the whole board, then throw most of it away",who:"data/norta/scripts/pull_bids.py",summary:["The site's protection layer blocks a headless browser, so a real Chromium window has to open. It is parked at position -2000,0 to keep it off the visible desktop. Three pages of the grid give 147 rows. Then the script visits all 147 detail pages for the bid body, and only after that drops everything whose status is not Open. Eight survive.","So 139 detail pages were fetched and discarded. That is where nearly six minutes went."],cells:[{label:"In → Out",paths:[{path:"https://norta.procureware.com/Bids",size:"3 pages of a JavaScript grid"},{path:"data/norta/bids/all-bids.json",size:"42,064 bytes · 8 rows · 16 fields"},{path:"data/norta/bids/index.json",size:"196 bytes"},{path:"data/norta/logs/pull_bids_log.txt",size:"1,289 bytes"}],blocks:[` page 1: 50 rows, 50 new (total 50)
 page 2: 53 rows, 51 new (total 101)
 page 3: 47 rows, 46 new (total 147)
 no next-page button — stopping pagination

fetching detail pages for 147 rows
 detail 10/147 elapsed 22s
 …
 detail 140/147 elapsed 320s
detail phase: 147/147 ok in 356.1s

filtered to OPEN status: 8 bids (from 147 raw rows)`],notes:[],tables:[]},{label:"Real record Bid A",paths:[],blocks:[`{
 "id": "207601",
 "number": "RFQ RTAR_03915",
 "title": "Instructional Design and
 Development Streetcar Curriculum",
 "description_summary": "show",
 "status": "Open for Bidding",
 "bid_type": "Default Bid Type",
 "contact": "If you have any questions,
 please contact Leah LeBlanc 504-827-8382
 or LeLeBlanc@rtaforward.org.",
 "available_date": "7/23/2026 12:00 PM",
 "clarification_deadline": "",
 "due_date": "7/30/2026 11:00 AM",
 "categories": "926, 927, 928...",
 "owner": "Regional Transit Authority
 of New Orleans",
 "state": "LA",
 "detail_url": "https://norta.procureware.com/
 Bids/fb1cafb6-d3ae-4730-b628-5bd6f5fd697d",
 "description_full": "Home\\n Bids\\n Activities\\n
 Documents\\nRegional Transit Authority New
 Orleans Procurement\\nLog In\\nRegister\\n
 (UTC-12:00) International Date Line West\\n…",
 "_detail_ok": true
}`],notes:["owner and state are not read from the page. They are typed into the script. Every NORTA bid gets the same two values."],tables:[]}],notes:['Look again at two fields. First, description_summary is the literal word "show", which is the text of the expander link in the grid cell, not a description. All eight rows have it. Second, description_full is 4,442 characters of page text that begins with the site navigation and then runs through the entire time-zone drop-down. Here is how that same record ends:'],then:"the eight open bids are compared with the last archived day"},{n:"4",title:"What is new, and what goes to the judge",who:"data/norta/scripts/prep_bids.py",summary:["Each bid is keyed by its NORTA bid number, like RFQ RTAR_03915. Anything already decided on 23 July keeps its old decision and lands in the carryover file. The rest go on the new list: five of them.","Separately, and this is the part that matters, a fat judge record is built for every open bid, new or not. That is why five new bids still produce eight judge records and eight fresh verdicts."],cells:[{label:"Out · three files plus the funnel",paths:[{path:"data/norta/runs/triage-input.json",size:"1,122 bytes · 5 rows"},{path:"data/norta/runs/triage-carryover.json",size:"464 bytes · 3 rows"},{path:"data/norta/runs/judge-input.json",size:"43,612 bytes · 8 rows"},{path:"data/norta/runs/_funnel.json",size:"149 bytes"}],blocks:[`{
 "bid_id": "IFB 2026-019",
 "title": "Replace Trolley Lift Cable",
 "decision": "OPEN",
 "reason": "direct-judge small batch"
}`],notes:["Bid B is not new tonight. It still gets re-judged at stage 6, at full cost, because the judge list ignores the new/old split."],tables:[]},{label:"Bid A in the new list Bid A",paths:[],blocks:[`{
 "idx": 0,
 "bid_id": "RFQ RTAR_03915",
 "title": "Instructional Design and
 Development Streetcar Curriculum",
 "owner": "Regional Transit Authority
 of New Orleans",
 "state": "LA",
 "due_date": "7/30/2026 11:00 AM"
}`,`{
 "idx": 0,
 "bid_id": "RFQ RTAR_03915",
 "description_full": "Bid #: RFQ RTAR_03915\\n
 Title: Instructional Design and Development
 Streetcar Curriculum\\nOwner: Regional Transit
 Authority of New Orleans\\nState: LA (New Orleans
 Regional Transit Authority)\\nStatus: Open for
 Bidding\\nBid type: Default Bid Type\\n
 Categories (NAICS): 926, 927, 928...\\n
 Available: 7/23/2026 12:00 PM Due: 7/30/2026
 11:00 AM Clarif. deadline: \\nContact: If you
 have any questions, please contact Leah LeBlanc
 504-827-8382 or LeLeBlanc@rtaforward.org.\\n
 Source URL: https://norta.procureware.com/Bids/
 fb1cafb6-d3ae-4730-b628-5bd6f5fd697d\\n\\n
 Grid description: show\\n\\nDetail RFP body:\\n
 Home\\n Bids\\n Activities\\n Documents\\n…"
}`],notes:[],tables:[]}],notes:["Read the line that says Grid description: show. The junk from stage 3 is now inside the judge's prompt, labelled as if it were a description. Everything after Detail RFP body: is the navigation and time-zone list. The judge is being asked to score a bid from its title, its NAICS numbers and its dates. Note also that the five new bids sit at positions 0, 1, 5, 6 and 7 of the snapshot. The idx field is the row's place in the eight-bid snapshot, not a counter for the new list."],then:"the screening pass is skipped entirely"},{n:"5",title:"The screening pass this portal does not use",who:"Pass 1 · max-triage · did not run",summary:["On big portals a cheap first pass reads titles and marks each bid OPEN or SKIP, so the expensive judge only sees the survivors. NORTA's open list is tiny, so the rule is to skip that pass whenever the snapshot is ten bids or fewer. Eight bids, so it was skipped.","That is why the funnel above has no skip cell. Nothing died on a title tonight."],cells:[{label:"In · written, then read by nobody",paths:[{path:"data/norta/runs/triage-input.json",size:"1,122 bytes · 5 rows"}],blocks:[],notes:["This file is produced every single run. On a skip night no script opens it. It is still not dead weight: its row count is what becomes new_to_triage: 5 in the day's stats, by way of _funnel.json."],tables:[]},{label:"Out",paths:[],blocks:[],notes:["Nothing. This is a real gap, shown rather than hidden. The file the next stages expect from Pass 1, runs/triage-verdicts.json, is not written here. What sits at that path at this moment is the copy the previous run left behind: none of the three scripts clears runs/. It is overwritten two stages later out of the judge's output, and if the agent ever skipped that step, compile would archive last run's file without complaining. If NORTA ever posts more than ten open bids at once, this stage becomes real and the manufacturing step stops."],tables:[]}],notes:[],then:"all eight open bids go straight to the expensive read"},{n:"6",title:"The judge, working with almost nothing",who:"max-bid-judge · AI → runs/judge-verdicts.json",summary:["Each of the eight bids gets a yes, maybe or no, a score out of 100, a reason, and lists of good and bad signals. That night: zero yes, zero maybe, eight no. The scores ran from 3 to 8.",'The judge itself reads one shared persona file, with nothing about this portal in it. The transit-specific steer lives in the runbook the child agent follows, hard rule 6 of ../.claude/skills/norta-sweep/SKILL.md: transit-authority buyers are mostly off-profile for this contractor, and any "Disaster Recovery / FEMA / Storm" title must be read carefully, because managing paperwork is a different business from clearing debris.'],cells:[{label:"In → Out",paths:[{path:"data/norta/runs/judge-input.json",size:"43,612 bytes · 8 rows"},{path:"data/norta/runs/judge-verdicts.json",size:"10,347 bytes · 8 rows · 17 fields"}],blocks:[`IFB 2026-019 8 no
RFQ RTAR_03915 6 no
RFQ RTAR_03961 4 no
IFB 2026-021 4 no
RFQ RTAR_03969 4 no
RFQ RTAR_03962 4 no
IFB 2026-020 3 no
RFQ RTAR_3557- 2 (REBID) 3 no`],notes:["The list itself tells the story: motor oil, a pinion gear, refrigerant cylinders, a social media platform, armored guards, managed IT. This is a bus and streetcar operator buying parts and services. None of it is tree, debris or right-of-way work."],tables:[]},{label:"Real record Bid B · the night's high score",paths:[],blocks:[`{
 "bid_id": "IFB 2026-019",
 "title": "Replace Trolley Lift Cable",
 "would_lgs_bid": "no",
 "score": 8,
 "category": "non-fit",
 "primary_reason": "Replacing the cable on a
 shop vehicle lift is transit-garage mechanical
 repair, not tree, debris, or ROW work.",
 "service_match": "non-fit",
 "scale_match": "unknown",
 "buyer_match": "adjacent",
 "red_flags": [
 "wrong_vertical_mechanical_equipment_repair",
 "single_asset_shop_equipment_scope",
 "thin_description_pull_rfp_packet"
 ],
 "fit_signals": ["in_core_state_la"],
 "kansas_city_risk": false,
 "closed_award": false,
 "elaboration": "Title reads 'Replace Trolley
 Lift Cable', contact is Shaun Temple at NORTA,
 and NAICS are 33/331/332 — primary metal and
 fabricated metal product manufacturing. The
 DESCRIPTION block rendered empty on the detail
 page, so no scope narrative was captured. The
 word 'trolley' here points at NORTA's streetcar
 maintenance shop, not at overhead line
 clearance…",
 "_first_judged": "2026-07-05",
 "verdict": "no"
}`],notes:[],tables:[]}],notes:[`The judge caught the stage-3 defect on its own. Both tracers carry the flag thin_description_pull_rfp_packet, and both elaborations say the DESCRIPTION block rendered empty. Bid A's says it plainly: "The ProcureWare DESCRIPTION block rendered empty, so the title plus the NAICS codes are the only scope text we hold." That flag is an instruction to a human, go log in and pull the packet, and not something any script retries. It is not empty every time. One carried bid on this same page, RFQ RTAR_03748-2 (Porta Potty Cleaning), does have a real body, and its elaboration quotes it: "bi-weekly cleaning services for two (2) porta-potties, including sewerage disposal…". So the capture works on some postings and not on others, and nothing in the pipeline records which is which. Also worth noticing: _first_judged on Bid B is 2026-07-05. It has been re-scored on every run since, and the answer has never changed.`],then:"the missing Pass-1 file gets invented after the fact"},{n:"7",title:"Back-filling a file for a pass that never ran",who:"child agent writes runs/triage-verdicts.json",summary:[`The next script needs a Pass-1 verdicts file. Pass 1 did not run. So the agent writes one from the judge's output: one row per judged bid, decision OPEN, reason "direct-judge small batch (Pass 1 skipped)".`,"The file is built from the judge list, not the new list. That is the whole reason the day's numbers read 5 new but 8 open."],cells:[{label:"In → Out",paths:[{path:"data/norta/runs/judge-verdicts.json",size:"8 rows"},{path:"data/norta/runs/triage-verdicts.json",size:"1,637 bytes · 8 rows · all OPEN"}],blocks:[],notes:[],tables:[]},{label:"Real record Bid A",paths:[],blocks:[`{
 "bid_id": "RFQ RTAR_03915",
 "title": "Instructional Design and
 Development Streetcar Curriculum",
 "decision": "OPEN",
 "reason": "direct-judge small batch
 (Pass 1 skipped)",
 "_judged": "2026-07-28"
}`],notes:['"OPEN" here means only "this bid was sent to the judge". It is not a screening opinion. Nobody screened anything.'],tables:[]}],notes:[],then:"the day's folder is written"},{n:"8",title:"Compile the day's archive",who:"data/norta/scripts/compile_insights.py",summary:["The three carried rows go in first and the eight invented rows are appended, but only for bid numbers not already there. So the carried rows win: those three keep the older reason direct-judge small batch and carry no _judged stamp, while the five genuinely new ones arrive stamped 2026-07-28. The day's triage file ends at eight, all OPEN. The verdicts are paired to them, and the folder for 28 July is written.","One thing to hold on to: new-bids.json here is not a delta. It is the entire open snapshot, byte for byte the same 42,064 bytes as bids/all-bids.json. That makes a downstream check honest, as stage 9 explains."],cells:[{label:"Out · data/norta/daily/2026-07-28/",paths:[],blocks:[],notes:['Two dead things live in this script. Its report gives MAYBE a heading and a full write-up of every row, while YES gets one cell in the Numbers table and no section of its own. And a hardcoded sentence still says "6 bids on the Day-1 snapshot" on every single run, months later. Neither matters, because a later stage overwrites the file completely.'],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","8 rows, the full open snapshot","42,064 B"]},{header:!1,cells:["triage.json","8 rows, all OPEN","1,496 B"]},{header:!1,cells:["verdicts.json","8 rows at this moment","grows at stage 9"]},{header:!1,cells:["stats.json","the funnel counts","396 B"]},{header:!1,cells:["report.md","a summary that gets overwritten","390 B"]}]]},{label:"stats.json, the whole file",paths:[],blocks:[`{
 "date": "2026-07-28",
 "source": "norta",
 "endpoint": "https://norta.procureware.com/Bids",
 "snapshot_total": 8,
 "carryover_count": 3,
 "new_to_triage": 5,
 "triage": {
 "open": 8,
 "total": 8
 },
 "scoring": {
 "yes": 0,
 "maybe": 0,
 "no": 8,
 "total": 8
 },
 "verdicts_unresolved": 0,
 "generated_at": "2026-07-28T19:14:15.021254+00:00"
}`],notes:["Written at 19:14. The carry-forward at stage 9 changes verdicts.json afterwards and never comes back to correct this file. That is the 8-versus-24 gap, and it is the reason the batch rules forbid adding up per-portal scoring counts."],tables:[]}],notes:[],then:"the portal's own work is done, the shared machinery takes over"},{n:"9",title:"Carry forward: this portal IS in it",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:['The registry says carry_forward: "orchestrator". In plain words: the shared step handles it, so a bid judged once keeps its verdict on every later run even if the judge does not look at it again. The alternative settings are "engine-internal", meaning the portal does it inside its own sweep, or "none", meaning nobody does. NORTA gets the shared one, and it fires on this run.',"It copied the 23 July verdicts on top of tonight's. Sixteen came across, four were dropped because tonight's judge had already re-scored them, none aged out. Eight plus sixteen is twenty-four."],cells:[{label:"_carryforward_audit.json, the whole file · 420 bytes",paths:[],blocks:[`{
 "portal": "norta",
 "ok": true,
 "skipped": false,
 "today": "2026-07-28",
 "prior_date_used": "2026-07-23",
 "today_new_judged": 8,
 "carried_forward": 16,
 "carried_forward_not_in_today_snapshot": 16,
 "dropped_too_old": 0,
 "dropped_already_judged_today": 4,
 "dropped_closed_award": 0,
 "final_total": 24,
 "final_yes": 0,
 "final_maybe": 0,
 "final_no": 24,
 "max_age_days": 90
}`],notes:[`All sixteen carried rows are for bids that have left the portal. On most portals that number is ambiguous, because their snapshot is only a slice. Here it is exact: stage 8 wrote the complete open list, so "not in today's snapshot" really does mean "this bid has closed at NORTA". Sixteen closed bids are being carried against an eight-bid board, and only the 90-day age cap will ever clear them.`],tables:[]},{label:"A carried row · closed at the portal, still in the file · eight scoring fields trimmed",paths:[],blocks:[`{
 "bid_id": "RFQ RTAR_03748-2",
 "title": "Porta Potty Cleaning",
 "would_lgs_bid": "no",
 "score": 4,
 "category": "non-fit",
 "primary_reason": "Bi-weekly servicing of two
 portable toilets at one bus-yard address is
 sanitation/janitorial work, an explicit non-fit
 and nowhere near the vegetation or debris
 column.",
 "red_flags": [
 "janitorial_sanitation_non_fit",
 "low_scale_inferred_single_site",
 "low_scale_inferred_rfq_informal",
 "rebid_of_rtar_03748_1"
 ],
 "_first_judged": "2026-07-23",
 "verdict": "no",
 "_carryforward_from": "2026-07-23",
 "_in_today_snapshot": false
}`],notes:["Three of the sixteen carried rows have no title key at all: IFB 2026-016, RFQ RTAR_03839 and RFQ RTAR_03825-1. The key is absent, not blank. Any reader that assumes a title is present has to cope."],tables:[]}],notes:[],then:"the ledger, the report and the board fixtures are rebuilt"},{n:"10",title:"Ledger, report, board cards",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared steps in a row. The first walks every verdicts file this portal has ever written and folds the good ones into the running ledger. The second throws away the report compile wrote and rebuilds it in the shared layout. The third turns YES verdicts into cards for the review board.","The third one is where this portal stops. The card dumper keeps YES only, for every portal that is not a federal feed. Zero YES means zero cards, tonight and every night."],cells:[{label:"The rebuilt report, the whole file · 390 bytes",paths:[],blocks:[`# norta — 2026-07-28

**Source:** https://norta.procureware.com/Bids · engine \`\` · state LA

- Snapshot: **8** open bids
- Carryover: 3 · NEW today: 5
- Triage: 8 OPEN / None SKIP
- Scored: **0 YES / 0 MAYBE / 24 NO**

## YES — Max would bid

_none_

## MAYBE — operator judgment

_none_

---
_Standardized report · regenerated 2026-07-28T22:37:28+00:00_`],notes:['A defect is hiding in this report, kept invisible only by the zeroes. The renderer looks up each verdict in the snapshot using the first id-looking key it finds, and for this portal that is id, the ProcureWare integer such as 207601. But every verdict is keyed by the bid number, RFQ RTAR_03915. So the lookup misses on every single row. The day a YES or MAYBE appears, its buyer will render as a dash and its due date as "unknown". Nothing warns.',"Note the empty engine ``. The registry leaves that field blank for this portal. And note 24, not 8: this report reads verdicts.json after the carry-forward, so it sees the merged file."],tables:[]},{label:"The board fixture, after the dump",paths:[{path:"PortalPro/src/fixtures/portal-bids.json",size:"1,470 cards · 0 of them norta"}],blocks:[`{
 "portal": "norta",
 "bid_id": "RFP 2026-015",
 "title": "Disaster Recovery Fema Management",
 "buyer": "?",
 "state": "?",
 "score": 42,
 "verdict": "maybe",
 "category": "Cat 1 — ambiguous",
 "reason": "Title fires a Cat 1 signal but
 'Management' is the red word — transit
 authorities hire FEMA recovery consultants to
 manage reimbursement documentation and program
 compliance, not to haul debris; the portal body
 is pure boilerplate with no scope text to
 disambiguate…",
 "flags": [
 "management_modifier_suggests_consulting_
 not_field_work",
 "buyer_is_transit_authority_non_core_
 for_debris",
 "description_body_empty_login_required",
 "naics_residential_construction_tags_
 are_noisy_portal_artifacts",
 "thin_description_pull_rfp_packet"
 ],
 "close_date": "",
 "first_seen": "2026-05-26",
 "last_seen": "2026-06-03",
 "runs_seen": 4,
 "_first_judged": null
}`],notes:['The slug and the run date go in the header anyway: last_run_dates.norta = "2026-07-28", label "New Orleans RTA". So the board knows this portal swept, and has nothing to show for it.',"Read from data/portals/cumulative-yes.json. It is a MAYBE from 26 May, the only non-NO this portal has ever produced. Buyer and state are literal question marks. The card dumper is YES-only, so this bid has never appeared on the review board. The ledger file is the only place it exists. Its own flag says description_body_empty_login_required: the same stage-3 hole, spotted in May."],tables:[]}],notes:[],then:"portals stop being folders and become rows on one shared board"},{n:"11",title:"Publish, cluster, de-duplicate",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → apply_llm_dedup.py",summary:["This is where every portal's bids are pushed into one shared database and the same solicitation seen on two different sites is collapsed into a single row. NORTA arrives with zero bids. It gets a portal row and a run row carrying tonight's counts, and that is all.","The pruning step is safe here. It only deletes inside portals that contributed at least one card, so a portal that contributed nothing is kept, not wiped."],cells:[{label:"What actually lands",paths:[],blocks:[],notes:[],tables:[[{header:!0,cells:["Table","What norta writes"]},{header:!1,cells:["portals","one row. The slug is on the declared list, so the row is upserted even with no bids"]},{header:!1,cells:["sweep_runs","one row, carrying open, no and raw counts read from tonight's stats.json; yes and maybe are 0"]},{header:!1,cells:["bids","nothing"]},{header:!1,cells:["clusters","nothing. No bids to cluster"]}]]},{label:null,paths:[],blocks:[],notes:["What is lost by never publishing. Clustering is what lets one Louisiana solicitation seen here and also on the state portal become a single item for the reviewer. With zero rows, this portal can never contribute a match, and no de-duplication pair involving it is ever proposed. Whether that matters depends entirely on whether the YES-only card gate at stage 10 is the right gate for a portal whose only non-NO across 39 archived days was one MAYBE."],tables:[]}],notes:[],then:"the board tries to fetch documents and read the requirements"},{n:"12",title:"Documents and requirements: both no-ops",who:"2.85b run_enrichment_phase.py + publish_bid_documents.py · 2.87 requirements",summary:["The document publisher sweeps every portal's snapshot file looking for an attachments list. It does open this portal's file. It finds no attachments field on any row, so it stops before a single network call. The requirements reader works only from published clusters, and there are none.","The reason is at stage 3: the pull takes the detail page's visible text and never touches the bid documents tab. Downloading those needs a login, and we do not log in here."],cells:[{label:null,paths:[],blocks:[],notes:["The saddest line in the whole flow. The pull DOES capture a per-bid page body into description_full, 4.4 KB of it per bid, at a cost of 356 seconds a run. Nothing ever publishes that text. It feeds the judge and then dies with the run. And as stage 3 showed, on most of these bids it is not the bid text anyway."],tables:[[{header:!0,cells:["Step","What happens for this portal"]},{header:!1,cells:["Registry enrichment passes","enrich_passes: []. None configured, and no pass in the shared runner names this slug"]},{header:!1,cells:["Global document publisher","reads data/norta/bids/all-bids.json, filters for rows with a documents list, gets an empty set, skips"]},{header:!1,cells:["Document text extraction","no documents, no clusters, nothing to read"]},{header:!1,cells:["Requirements extraction (2.87)","cluster-scoped, and there are no clusters"]},{header:!1,cells:["Bid packs (2.89)","rendered per cluster; zero clusters means zero packs"]}]]}],notes:[],then:"de-duplication runs a second time on the freshly filled fields"},{n:"13",title:"The second look at duplicates",who:"2.875 · de-duplication re-pass",summary:["After enrichment fills in buyers and due dates, the de-duplication pass runs again on the better data, because two records that looked different before can now be seen as the same bid.","Nothing of this portal's is in scope. There are no clusters to re-compare, for the same reason as stage 11."],cells:[{label:"Out",paths:[],blocks:[],notes:["No candidate pair, no merge, no change. This stage is on the page because the run really does execute it, not because it does anything here."],tables:[]}],notes:[],then:"what changed since last time, and did the run finish"},{n:"14",title:"Watch, digests, health check",who:"2.88 · watch_list_signals.py · the digest mails · pipeline_sentinel.py",summary:["The digests report bids that reached the shared board, so this portal never appears in one. The health check is the one shared step that genuinely looks at it: did the sweep run on time, and did each step produce its file."],cells:[{label:"Watch · set to none, and mostly blind anyway",paths:[],blocks:[],notes:[],tables:[[{header:!1,cells:['Registry watch: "none"',"no source re-capture runs for this portal"]},{header:!1,cells:["Free list-signal watcher","the grid has no addendum counter, so the only signal it could see is a due-date move"]},{header:!1,cells:['"Status left Open"',"invisible by construction. Stage 3 drops non-Open rows before anything is saved, so a bid closing looks the same as a bid vanishing"]},{header:!1,cells:["Digest emails","silent until the mail key is configured, and this portal would have nothing to send regardless"]}]]},{label:"The health check's verdict, verbatim",paths:[],blocks:[`{
 "slug": "norta",
 "batch": "portals",
 "status": "GREEN",
 "issues": [],
 "last_archive": "2026-07-28",
 "surfaced": 0
}`],notes:['From data/portals/sentinel.json. GREEN with zero surfaced. The check is asking "did the machine run", not "did the machine find anything". Both answers are correct and they point in opposite directions.'],tables:[]}],notes:[],then:"the only two screens where a person ever sees this portal"},{n:"15",title:"The tracking board and the overview",who:"2.9 / 2.95 · build_portal_metrics.py → build_monitor_html.py → build_portals_overview.py",summary:["Every day's stats file becomes one cell in a grid: pulled, new, open, yes over time. The overview page then inlines today's report. For an operator, these two pages are the only place this portal is visible at all. The review board, the digests and the bid packs never show it."],cells:[{label:"The last four cells of this portal's row, verbatim",paths:[],blocks:[`2026-07-13 {"snapshot": 7, "new": 7, "open": 7, "yes": 0, "maybe": 0, "no": 7}
2026-07-16 {"snapshot": 5, "new": 1, "open": 5, "yes": 0, "maybe": 0, "no": 5}
2026-07-20 {"snapshot": 5, "new": 1, "open": 5, "yes": 0, "maybe": 0, "no": 5}
2026-07-23 {"snapshot": 5, "new": 1, "open": 5, "yes": 0, "maybe": 0, "no": 5}`],notes:["Read from data/portals/metrics.json. Its own header says generated_at: 2026-07-24T22:32:17+00:00, so the copy on disk predates the run this page describes and has no 28 July column yet."],tables:[]},{label:"The row summary, verbatim",paths:[],blocks:[`{
 "slug": "norta",
 "label": "New Orleans RTA",
 "state": "LA",
 "core": true,
 "baseline": 6,
 "baseline_date": "2026-05-26",
 "latest_snapshot": null,
 "totals": {
 "yes": 0,
 "maybe": 1,
 "no": 197,
 "new": 141
 },
 "active": true
}`],notes:['latest_snapshot: null is a mechanism, not a bug report. That field reads the cell at the newest date in the whole grid. This portal runs every three days, so on any date it did not sweep, its "latest snapshot" reads empty on the board. Louisiana is a core state, so this row sits among the ones an operator is meant to care about, showing 0 yes against 197 no.'],tables:[]}],notes:[],then:"the numbers anyone is allowed to quote"},{n:"16",title:"Roll-up and scorecard",who:"3 / 4 / 4.99 · roll-up.md · goalstate_matrix.py · scorecard.py",summary:["The operator writes a single summary across all portals, then the scorecard queries the shared database for the only YES figure anyone should quote. This portal has never moved that figure."],cells:[{label:"Where it appears in the 28 July roll-up",paths:[],blocks:[],notes:['Nowhere by name. Reading data/portals/daily/2026-07-28/roll-up.md, this portal is inside the line "46 of 48 portals dispatched" and inside "45 produced an archive". It is absent from the deadline table and absent from the scorecard block, because it produced nothing to list.',"The daily-new-bids matrix is scoped to bids first seen today in the shared database, so this portal never gets a row there either."],tables:[]},{label:null,paths:[],blocks:[],notes:['The one number a person should carry away from this run. Not 8, not 24. It is zero: zero bids on the board, zero clusters, zero documents, zero requirements, zero digest lines. Against 356 seconds of browser time, 147 fetched pages and 8 language-model judgements, on a three-day beat, in a core state. The honest question this page raises is not "is anything broken". The sentinel is GREEN and it is right. It is "is this portal worth the six minutes".'],tables:[]}],notes:[],then:null}],d=[{heading:"Where the written model and the disk disagree",tables:[[{header:!0,cells:["The model doc says","The files say"]},{header:!1,cells:['"145 raw grid rows -> 5 open bids"; "about 5 bids survive out of 145"',"147 raw rows, 8 open. Three grid pages of 50, 53 and 47, 147 unique. From bids/index.json and the pull log."]},{header:!1,cells:['Stage 10: this portal "contributes nothing" to the cumulative ledger',"It contributes one row. data/portals/cumulative-yes.json carries RFP 2026-015, score 42, verdict maybe, in the live list. The ledger keeps MAYBEs; only the board card dumper is YES-only."]},{header:!1,cells:['"Across all 38 archived days"',"39 dated folders under data/norta/daily/, the newest being 2026-07-28."]},{header:!1,cells:["Stage 9's worked example: 20 verdict rows, 15 carried","24 rows, 16 carried on this run, prior date used 2026-07-23. The model's example is the previous run, not this one."]},{header:!1,cells:["description_summary appears only as a field name in the key lists at lines 117 and 229. Nothing is said about what it holds",'Every one of the 8 rows stores the literal string "show" as its summary. Not listed as a known wall anywhere.']}]],paragraphs:["Everything else in docs/portal-dataflow/norta.md held up against the files. The stale parts are all counts from the 23 July run plus the one ledger claim."]},{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["The detail page's DESCRIPTION block comes back empty on most bids, and the capture takes the whole body, so we bank navigation and a time-zone list instead","the judge scores from title, NAICS numbers and dates. Every verdict on this run carries thin_description_pull_rfp_packet. Not in the model doc's known walls"]},{header:!1,cells:[`description_summary is the literal word "show" on all 8 rows, the grid's expander link text`,'it is passed into the judge prompt as "Grid description: show". Pure noise dressed as content']},{header:!1,cells:["_detail_ok: true only means the browser did not throw an error",'a page that loaded but held no bid text is recorded as a success. 147 of 147 "ok" on this run']},{header:!1,cells:["The Open filter runs after all 147 detail pages are fetched","139 pages fetched and discarded, 356.1 seconds of the run. Moving the filter above the loop would cut it to about half a minute"]},{header:!1,cells:["A real browser window must open, because the site's protection layer blocks headless","a visible window appears on the operator's desktop for six minutes during an unattended run, and this cannot run on a headless server. A live question for any move to a hosted machine"]},{header:!1,cells:["Non-Open rows are dropped at the scrape, before anything is saved","a bid closing at the portal is indistinguishable from a bid vanishing. The change watcher can never see a status move"]},{header:!1,cells:["No documents, ever. The pull never touches the attachments tab","the document publisher and the requirements reader both skip this portal by design. Downloading would need a login we do not use"]},{header:!1,cells:['Contact is one free-text blob, verbatim "If you have any questions, please contact Leah LeBlanc 504-827-8382 or LeLeBlanc@rtaforward.org."',"the board publisher reads separate name, email and phone fields. Even on a YES, the contact would publish empty"]},{header:!1,cells:["The standardized report indexes the snapshot by id (207601) while every verdict is keyed by number (RFQ RTAR_03915)",'the join misses on every row. Masked today only because there are no YES or MAYBE rows to render. On the first one, buyer shows a dash and due shows "unknown"']},{header:!1,cells:["stats.json counts 8, verdicts.json holds 24","compile writes stats, then carry-forward grows the file afterwards. Never add per-portal scoring counts across portals"]},{header:!1,cells:["16 of the 24 verdict rows are for bids that have closed at the portal","only the 90-day age cap clears them. Since the snapshot here really is the complete open list, dropping them would be safe and nothing does"]},{header:!1,cells:["Three carried verdict rows have no title key at all (IFB 2026-016, RFQ RTAR_03839, RFQ RTAR_03825-1)","absent, not blank. Any consumer assuming the key exists must handle it"]},{header:!1,cells:["data/norta/runs/_judge_clean.json: 6 rows, dated 23 June, uses a description key the pipeline does not write","no script writes it and no script reads it. A leftover from a one-off hand session"]},{header:!1,cells:["The runbook at data/norta/PORTAL.md is still the auto-generated draft","every field-map row says TODO. The live audit for this portal has never been run"]},{header:!1,cells:[`Compile's own report writes out every MAYBE under its own heading but gives YES only a cell in the Numbers table, and carries a hardcoded line about "6 bids on the Day-1 snapshot"`,"harmless only because stage 10 overwrites the file every run"]}]],paragraphs:['Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read off disk from the named file; every count traces to data/norta/daily/2026-07-28/stats.json, data/norta/bids/index.json, a row count, or a byte size in docs/portal-dataflow/pedia-inspect/norta.json. No record on this page was written by hand. Board-fixture figures come from PortalPro/src/fixtures/portal-bids.json, which sits one directory above this repo. Baseline map: docs/portal-dataflow/norta.md (evidence-cited to file and line). See "Where the written model and the disk disagree" above for the five places it is stale.']}],h='Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read off disk from the named file; every count traces to data/norta/daily/2026-07-28/stats.json, data/norta/bids/index.json, a row count, or a byte size in docs/portal-dataflow/pedia-inspect/norta.json. No record on this page was written by hand. Board-fixture figures come from PortalPro/src/fixtures/portal-bids.json, which sits one directory above this repo. Baseline map: docs/portal-dataflow/norta.md (evidence-cited to file and line). See "Where the written model and the disk disagree" above for the five places it is stale.',c="docs/portal-dataflow/pedia-norta.html",p={slug:e,title:t,eyebrow:s,headline:a,lede:n,funnel:o,funnel_note:r,legend:i,stages:l,sections:d,footer:h,source_page:c};export{p as default,s as eyebrow,h as footer,o as funnel,r as funnel_note,a as headline,n as lede,i as legend,d as sections,e as slug,c as source_page,l as stages,t as title};
