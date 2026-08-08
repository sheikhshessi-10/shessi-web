const e="bidexpress",t="Bid Express: what happens to a bid, stage by stage",s="Portal pedia · 07",a="Bid Express: what happens to a bid, from a login wall to the board",n="Every stage of the run of 28 July 2026, with a real record from the actual file at each step. Bid Express sits behind a login, so the night starts with a saved cookie jar. That night the cookie jar had gone stale, the pull died, the login was refreshed, and the pull was run again, all inside 82 seconds. Three bids are followed the whole way.",o=[{value:"381",label:"in snapshot"},{value:"334",label:"carryover"},{value:"47",label:"new tonight"},{value:"60",label:"open · all time"},{value:"321",label:"skip · all time"},{value:"5",label:"yes · all time"},{value:"5",label:"maybe · all time"},{value:"50",label:"no · all time"}],i="All eight numbers come from data/bidexpress/daily/2026-07-28/stats.json (422 bytes). Only the first three describe that night. The last five are running totals over every bid still open on the portal, because this portal's archive files are cumulative, not daily. Tonight's own work was smaller and is countable file by file: 47 bids triaged (runs/triage-verdicts.json, 47 rows: 32 SKIP, 15 OPEN), 15 bids judged (runs/judge-verdicts.json, 15 rows: 3 yes, 1 maybe, 11 no).",r=["Bid A · 47948 · CTI-260019, Columbus State Community College, Ohio. Carries an old SKIP.","Bid B · 48171 · BRC0000650, Los Angeles County Public Works. Carries an old YES, score 90.","Bid C · 48374 · 26-25-1, St. Tammany Parish. The one that was actually decided that night. YES, score 65."],l=[{n:"1",title:"The cadence gate: is Bid Express due today?",who:"scripts/portal_due.py --batch portals",summary:["Bid Express is not swept every night. It runs every 3 days. The gate looks at the newest dated folder under data/bidexpress/daily/, compares its age to the cadence, and prints the slug only if the gap is big enough.","On 28 July the newest folder was 24 July. Four days is more than three, so the slug printed and the sweep was dispatched."],cells:[{label:"In",paths:[{path:"data/portals/registry.json",size:'cadence_days 3 · batch "portals" · authed true'},{path:"data/bidexpress/daily/<date>/",size:"folder names only"}],blocks:[],notes:[],tables:[]},{label:"Every archive folder that exists on disk",paths:[],blocks:[`2026-06-21
2026-07-11
2026-07-16
2026-07-20
2026-07-21
2026-07-24
2026-07-28 <- this page`],notes:["Seven runs total. The gaps are wider than 3 days in places, which is the honest record of a portal that ran nothing at all for the three weeks between 21 June and 11 July."],tables:[]}],notes:['A stale label lives here. data/bidexpress/config.json still says "standalone": true and its notes still say this portal is not in the shared batch. Nothing in the code reads that key. The real batch comes from registry.json, and it says portals. Dead prose in five places, no effect on behaviour.'],then:"the sweep starts by trying the saved cookies"},{n:"2",title:"Pull the whole open list",who:"data/bidexpress/scripts/run_daily.py (step 1: ps.pull)",summary:["No browser on this path. The script loads a saved cookie jar, walks the advertised list 100 rows at a time with plain web requests, and reads each card into a bid row. Title, agency, location, deadline and the scope text all come off the list card, so detail pages are never opened for scope.","The first attempt that night failed. It started at 17:50:04 and never logged a single page. The next stage is what fixed it."],cells:[{label:"In → Out",paths:[{path:"data/auth/bidexpress-cookies.json",size:"3,490 bytes"},{path:"data/bidexpress/bids/all-bids.json",size:"231,271 bytes · 381 rows"},{path:"data/bidexpress/bids/index.json",size:"334 bytes"},{path:"data/bidexpress/logs/pull_log.txt",size:"7,895 bytes"}],blocks:[`[2026-07-28T17:50:04.118289+00:00] Bid Express pull
 starting · cookies=bidexpress-cookies.json
 · today=2026-07-28
[2026-07-28T17:51:10.361448+00:00] Bid Express pull
 starting · cookies=bidexpress-cookies.json
 · today=2026-07-28
[2026-07-28T17:51:14.754715+00:00] page 1: 100 cards (cum 100)
[2026-07-28T17:51:17.817443+00:00] page 2: 100 cards (cum 200)
[2026-07-28T17:51:22.662763+00:00] page 3: 100 cards (cum 300)
[2026-07-28T17:51:26.513094+00:00] page 4: 84 cards (cum 384)
[2026-07-28T17:51:26.514271+00:00] is_open guard
 dropped 3 past-due rows
[2026-07-28T17:51:26.748775+00:00] wrote 381 open
 solicitations -> …\\data\\bidexpress\\bids\\all-bids.json`],notes:[],tables:[]},{label:"Real record Bid A",paths:[],blocks:[`{
 "bid_id": "47948",
 "title": "CTI-260019",
 "buyer": "Columbus State Community College",
 "agency": "Columbus State Community College",
 "status": "Open",
 "due_date": "2026-07-28",
 "due_date_raw": "07/28/2026",
 "state": "OH",
 "location": "Franklin, Ohio",
 "detail_url": "https://www.bidexpress.com/
 solicitations/47948",
 "description": "CSCC RH & MH Fire Alarm
 Upgrades",
 "_detail_ok": true
}`,`{
 "generated_at": "2026-07-28T17:51:26.722757+00:00",
 "snapshot_total": 381,
 "source": "bidexpress",
 "engine": "bidexpress",
 "endpoint": "https://www.bidexpress.com/
 solicitations?dir=asc&limit=100&page=1
 &show_all=true&sort=deadline&status=advertised",
 "rows_parsed": 384,
 "open_total": 381,
 "auth": "cookie"
}`],notes:[],tables:[]}],notes:['The 200-character wall, and the model doc is wrong about it. The stage model says the list card carries "the full untruncated scope", so no extra fetch is needed. The file disagrees. In the 381-row snapshot the longest description is exactly 200 characters, 181 rows hit that ceiling, and 179 of them end in a literal ... that the portal itself put there. Nothing downstream fetches the rest before the AI reads it. The judge notices. See stage 7.'],then:"the pull failed, so the login runs. This is the only stage that opens a browser"},{n:"3",title:"Refresh the login, then try the pull again",who:"data/bidexpress/scripts/extended/recon_login.py",summary:["This stage only runs when the pull fails. It opens the login wall, gets past the bot check, types the email and then the password into a two-step form, lands back on the solicitations page, and saves the fresh cookies. Then the pull is run a second time.","It ran on 28 July. The file timestamps sit exactly inside the 66-second gap between the two pull attempts, so the whole conditional path is visible on disk for that one night."],cells:[{label:"Out: three files, all written in the same two seconds",paths:[{path:"data/auth/bidexpress-cookies.json",size:"written 17:51:03 UTC"},{path:"…/extended/solicitations_rendered.html",size:"294,435 bytes · 17:51:03 UTC"},{path:"…/extended/recon_capture.json",size:"10,304 bytes · 17:51:04 UTC"}],blocks:[],notes:[],tables:[]},{label:"The 82 seconds, in order, from file times and the log",paths:[],blocks:[`17:50:04 pull attempt 1 starts
 (no pages logged, it died here)
17:51:03 fresh cookies saved
17:51:03 solicitations page saved as HTML
17:51:04 network capture saved
17:51:10 pull attempt 2 starts
17:51:26 381 solicitations written`],notes:[],tables:[]}],notes:["This stage cannot report its own failure. The login script prints its errors and still exits with a success code, even when the login did not take. The only real check is whether the second pull works. So a broken login and a broken website look identical from outside. Also unsettled: the script defaults to running with no visible window, while two other documents say to run it with one. The code default wins."],then:'now split the 381 into "already decided" and "new"'},{n:"4",title:"Split new from already-decided",who:"data/bidexpress/scripts/run_daily.py (step 2: ps.prep)",summary:["Every bid id in tonight's snapshot is checked against the newest earlier archive, daily/2026-07-24/triage.json. A bid that already has a decision becomes carryover and keeps it. The rest are new and go to the AI.","381 in, 334 already decided, 47 new. This is the step that keeps the cost down: the AI only ever sees the 47."],cells:[{label:"Out: four files",paths:[{path:"runs/triage-input.json",size:"9,387 bytes · 47 rows"},{path:"runs/triage-carryover.json",size:"36,641 bytes · 334 rows"},{path:"runs/judge-input.json",size:"248,548 bytes · 381 rows"},{path:"runs/_funnel.json",size:"156 bytes"}],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 381,
 "carryover_count": 334,
 "triage_input_count": 47,
 "prior_archive_ids_compared_against": 370
}`],notes:[],tables:[]},{label:"Real record Bid A, carried not re-asked",paths:[],blocks:[`{
 "bid_id": "47948",
 "decision": "SKIP",
 "reason": "non-LGS work (Pass 1)"
}`,`{
 "idx": 216,
 "bid_id": "48374",
 "title": "26-25-1",
 "buyer": "St. Tammany Parish Government",
 "state": "LA",
 "due_date": "2026-08-11"
}`],notes:["From runs/triage-carryover.json. This decision was bought on an earlier night.","From runs/triage-input.json. Six fields. No description. The AI sees a bare code number and a parish name."],tables:[]}],notes:["The carryover split, exactly. Of the 334 carried bids, 289 carry a SKIP and 45 carry an OPEN, and all 45 of those OPENs already had a verdict, so none needed re-judging. That is why stage 6 queues exactly the night's 15 new OPENs and nothing else."],then:"47 titles go to the AI, nothing else does"},{n:"5",title:"Pass 1: keep or bin, from the title alone",who:"max-triage · AI, on runs/triage-input.json",summary:["The AI reads 47 titles and marks each OPEN or SKIP. The default answer is SKIP. It says OPEN only on a work signal: trees, debris, vegetation, right-of-way, clearing, mowing, storm, demolition, ditch, or a cryptic code number attached to a public-works buyer.","Result: 32 SKIP, 15 OPEN. Where the bid is in the country makes no difference; a Massachusetts bid is read the same way as a Mississippi one."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"47 rows"},{path:"runs/triage-verdicts.json",size:"4,142 bytes · 47 rows"}],blocks:[`{
 "bid_id": "48366",
 "decision": "SKIP",
 "reason": "park make-ready/parking,
 construction"
}`,`{
 "bid_id": "48361",
 "decision": "SKIP",
 "reason": "port Goods & Services,
 commodity batch"
}`],notes:[],tables:[]},{label:"Real record Bid C, opened",paths:[],blocks:[`{
 "bid_id": "48374",
 "decision": "OPEN",
 "reason": "St. Tammany Parish,
 debris precedent"
}`],notes:["Look at what opened this bid. The title was 26-25-1. There is no work signal in that at all. It opened on the buyer: St. Tammany Parish, where LGS has done debris work before. This is the cryptic-code rule doing its job, and it is the reason bare code numbers are not binned on sight.","Bid A and Bid B are not in this file at all. They were carried, not asked."],tables:[]}],notes:[],then:"the 15 OPENs get their scope text glued back on"},{n:"6",title:"Build the queue for the second AI",who:"ps.enrich_opens (does nothing here) → ps.build_judge_input_open",summary:["This step gathers every OPEN bid that still has no verdict: tonight's new OPENs, plus any older OPEN that was never judged, plus anything already judged whose details changed. Then it rebuilds each row with the scope text from the snapshot.","That night the queue came to exactly the 15 new OPENs: no old backlog, no re-judges. The extra-fetch step before it is a real no-op for this portal: there is no detail fetcher, because the scope is supposed to be on the list card already."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json + runs/triage-carryover.json + daily/2026-07-24/verdicts.json + bids/all-bids.json",size:null},{path:"runs/judge-input-open.json",size:"8,486 bytes · 15 rows"}],blocks:[`48374 48375 48340 48372 48373
48345 48359 48360 48335 48350
48351 48363 48356 48349 48327`],notes:[],tables:[]},{label:"Real record Bid C, what the judge will read",paths:[],blocks:[`{
 "idx": 216,
 "bid_id": "48374",
 "title": "26-25-1",
 "buyer": "St. Tammany Parish Government",
 "state": "LA",
 "due_date": "2026-08-11",
 "detail_url": "https://www.bidexpress.com/
 solicitations/48374",
 "description_full": "Title: 26-25-1\\nBuyer: St.
 Tammany Parish Government\\nState: LA\\nCloses:
 2026-08-11\\nSource URL: https://www.bidexpress.
 com/solicitations/48374\\n\\nRFP body:\\nAutumn Wind
 Ln Drainage-----------------The Parish requests
 a Contractor to improve drainage by removing and
 replacing drainpipe and cleaning, shaping, and
 grading ditches along Autumn Wind Ln, loc..."
}`],notes:["That trailing loc... is not our cut. It is the portal's own 200-character clamp, copied through untouched. The sentence was going to say where the street is."],tables:[]}],notes:[],then:"the AI scores the 15"},{n:"7",title:"Pass 2: would LGS actually bid this?",who:"max-bid-judge · AI, on runs/judge-input-open.json",summary:["Yes, maybe or no, a score out of 100, a reason, and a list of warning flags. Fifteen bids in, fifteen answers out: 3 yes, 1 maybe, 11 no.","The two highest scores that night were both 90: Bid B's on-call channel clearing in Los Angeles (carried from an earlier night) and a New Mexico statewide vegetation management contract."],cells:[{label:"Out",paths:[{path:"runs/judge-verdicts.json",size:"4,732 bytes · 15 rows"}],blocks:[],notes:[`The judge sees the wall and says so. Read the last sentence of its reasoning below. It knew the description had been cut off, checked that the useful part landed before the cut, and scored anyway. Nothing upstream told it. It worked that out from the text. Two of the five YES bids in the archive carry the flag thin_description_pull_rfp_packet, which is the judge's way of saying "score is fine, but a human should open the actual packet".`],tables:[]},{label:"Real record Bid C, YES 65",paths:[],blocks:[`{
 "bid_id": "48374",
 "would_lgs_bid": "yes",
 "lgs_score": 65,
 "reasoning": "Visible scope is drainage ditch
 cleaning, shaping, and grading - squarely LGS's
 ditch-work trade - though the drainpipe removal/
 replacement piece leans civil and the single-road
 scope caps the score. Truncation doesn't change
 the call since the LGS-relevant scope is already
 stated before the cut.",
 "red_flags": [
 "low_scale_inferred_single_site",
 "hybrid_includes_drainpipe_replacement"
 ]
}`],notes:[],tables:[]}],notes:[],then:"tonight's answers are merged with every older answer"},{n:"8",title:"Write the day's archive",who:"ps.compile_archive(PORTAL, config)",summary:["Carryover decisions are merged with tonight's, old verdicts are merged with tonight's, and five files are written into daily/2026-07-28/. This merge is the portal's memory. There is no separate safety-net script for this portal. See stage 9.","That merge is why the archive files are cumulative: triage.json holds all 381 decisions and verdicts.json holds all 60 verdicts, not just the 47 and 15 that were bought tonight."],cells:[{label:"Out: the whole folder, as it sits on disk",paths:[],blocks:[],notes:["What is not in the folder: _carryforward_audit.json. That absence is the proof for stage 9."],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","381 rows, the full snapshot","231,271 B"]},{header:!1,cells:["triage.json","381 rows · 321 SKIP / 60 OPEN","41,767 B"]},{header:!1,cells:["verdicts.json","60 rows · 5 yes / 5 maybe / 50 no","36,008 B"]},{header:!1,cells:["stats.json","the funnel counts","422 B"]},{header:!1,cells:["report.md","the human summary","4,299 B"]}]]},{label:"Two rows from one file, different shapes",paths:[],blocks:[`{
 "bid_id": "48374",
 "would_lgs_bid": "yes",
 "lgs_score": 65,
 "reasoning": "Visible scope is drainage ditch
 cleaning, shaping, and grading…",
 "red_flags": ["low_scale_inferred_single_site",
 "hybrid_includes_drainpipe_replacement"],
 "bid_key": "bidexpress:48374",
 "score": 65,
 "verdict": "yes",
 "primary_reason": "Visible scope is drainage
 ditch cleaning…"
}`,`{
 "bid_id": "48171",
 "title": "BRC0000650",
 "buyer": "Los Angeles County Public Works",
 "state": "CA",
 "would_lgs_bid": "yes",
 "score": 90,
 "lgs_score": 90,
 "primary_reason": "On-call channel ROW clearing
 is core LGS ditch/channel clearing work with a
 recognizable standby structure.",
 "reasoning": "On-call channel ROW clearing is
 core LGS ditch/channel clearing work with a
 recognizable standby structure.",
 "red_flags": [],
 "due_date": "2026-07-27",
 "source_url": "https://www.bidexpress.com/
 solicitations/48171",
 "verdict": "yes"
}`],notes:[],tables:[]}],notes:[`Two real problems are visible in that pair. One: two row shapes in one file. The 15 rows written tonight carry bid_key but no title, buyer, state, due date or link. The 45 carried rows carry all of those but no bid_key. Anything reading this file has to handle both. 39 of the 60 rows have no due date at all. Two: one frozen due date, and it is the one that matters. Bid B's verdict row says it closes 2026-07-27. That verdict was written on 16 July, when the portal really did say 27 July. By 24 July the portal had moved the deadline to 2026-08-03, and tonight's snapshot still says 3 August. The verdict row was carried forward whole, so the old date rode along. On the run date of 28 July that makes the bid look already closed when it has six days left. It is the only row of the 60 where this bites, and it happens to be the highest-scoring YES on the board. Also here: stats.json writes "endpoint": "" even though bids/index.json, written minutes earlier, has the real address. The config file has no key for it.`],then:"the portal's own work ends here, the shared machinery takes over"},{n:"9",title:"The shared safety net: switched off for this portal, on purpose",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:[`Most portals get a separate script that rescues old verdicts for bids that dropped out of a night's pull. Bid Express is not in that list. Its registry setting is carry_forward: "engine-internal", which means the job is already done inside its own sweep, in stage 4 and stage 8.`,"Running the shared script here would apply the same merge twice. So it never opens this portal's folder."],cells:[{label:"How to tell, without reading any code",paths:[],blocks:[],notes:["What this means in practice. Bid Express keeps its own memory, in its own two files, on its own 3-day clock. That is fine while the sweep runs. It also means that if the sweep ever breaks, nothing else rescues the old verdicts. There is no second net under this one. That is exactly the failure that killed this portal for the three weeks between 21 June and 11 July, before the batch label was fixed on 16 July."],tables:[[{header:!1,cells:["The shared script writes _carryforward_audit.json into the day's folder","every portal it touches"]},{header:!1,cells:["data/bidexpress/daily/2026-07-28/ contains five files","new-bids · triage · verdicts · stats · report"]},{header:!1,cells:["No audit file","the script did not run here, confirmed on disk"]}]]}],notes:[],then:"the ledger, the report and the board file are rebuilt"},{n:"10",title:"Ledger, report, board file",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared steps, in order. The ledger walks every portal's archives and rebuilds one master list of every YES ever surfaced. The report step overwrites the report.md that compile just wrote with the one shared layout. The dump walks every Bid Express archive, keeps the YES verdicts, and writes them into the single file the publish step reads.","The timestamps show the order plainly: compile stamped stats.json at 18:02:07 UTC, the report was rewritten at 22:37:25, and the board file was written at 22:38:01, which is 36 seconds after the report."],cells:[{label:"Out",paths:[{path:"data/portals/cumulative-yes.json + .md",size:null},{path:"data/bidexpress/daily/2026-07-28/report.md",size:"4,299 bytes · rewritten 22:37:25 UTC"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"1,470 cards total · 6 from bidexpress"}],blocks:[`48171 90 BRC0000650 docs ✓
48363 90 RFP No. 27-28 docs ✗
47975 72 26-35-2 docs ✓
48150 70 2026-10 docs ✓
48374 65 26-25-1 docs ✗
48375 65 26-26-1 docs ✗`],notes:["Six cards, from all seven archive days, not from one night. Not one of the six has a contact email."],tables:[]},{label:"Real lines from report.md Bid B and Bid C",paths:[],blocks:[`## YES — Max would bid

- **[90] BRC0000650** — Los Angeles County
 Public Works · closes 2026-08-03
 On-call channel ROW clearing is core LGS
 ditch/channel clearing work with a
 recognizable standby structure.
 link: https://www.bidexpress.com/
 solicitations/48171

- **[65] 26-25-1** — St. Tammany Parish
 Government · closes 2026-08-11
 Visible scope is drainage ditch cleaning,
 shaping, and grading - squarely LGS's
 ditch-work trade…
 _flags: low_scale_inferred_single_site,
 hybrid_includes_drainpipe_replacement_`],notes:["The report gets the date right. It says Bid B closes 2026-08-03, not the frozen 27 July from the verdict row, because this step re-reads the live snapshot and looks the bid up fresh. The board file, one step later, does not. Same night, same bid, two different deadlines, and the wrong one is the one a human sees."],tables:[]}],notes:["MAYBE never leaves the machine. The dump keeps yes only for this portal. The 5 MAYBEs in tonight's archive, including a county demolition programme scored 55, are in the daily folder and in the cumulative ledger, and nowhere else. Nobody sees them on the board."],then:"bids stop being Bid Express bids here"},{n:"11",title:"Onto the shared board, and merged with everyone else's",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["The six cards are pushed into the shared database, keyed by portal plus source id. Then every portal's bids are clustered together, so one solicitation that shows up on Bid Express and on another portal becomes one card, not two. An AI settles the pairs that are too close to call.","What this portal contributes is its whole running YES set, not tonight's three."],cells:[{label:"In → Out",paths:[{path:"PortalPro/src/fixtures/portal-bids.json",size:"6 bidexpress cards"},{path:"database: bids, clusters, sweep_runs, dedup_adjudications",size:null},{path:"data/portals/llm-dedup-candidates.json",size:null}],blocks:[],notes:["One thing this portal does right. Its buyer names are read straight off the list card's link to the agency page. They are real agency names, not an AI's guess. Several portals feed the clustering step invented buyers that wrongly glue unrelated bids together. This one does not."],tables:[]},{label:"Real board card Bid B",paths:[],blocks:[`{
 "id": "65d58051bfb09d87",
 "portal": "bidexpress",
 "portal_label": "Bid Express (login)",
 "source_bid_id": "48171",
 "title": "BRC0000650",
 "buyer": "Los Angeles County Public Works",
 "state": "CA",
 "solicitation_no": null,
 "federal": false,
 "score": 90,
 "verdict": "yes",
 "category": "",
 "description": "On-Call Channel Right-of-Way
 Clearing Services for the East Maintenance
 Area (BRC0000650)\\r\\n\\r\\nPLEASE CHECK THE
 WEBSITE FREQUENTLY FOR ANY CHANGES TO THIS
 SOLICITATION. ALL ADDENDA AND INFORMATIONAL...",
 "due_date": "2026-07-27",
 "source_url": "https://www.bidexpress.com/
 solicitations/48171",
 "contact_name": null,
 "contact_email": null,
 "contact_phone": null,
 "red_flags": [],
 "first_seen": "2026-07-16",
 "last_seen": "2026-07-28",
 "has_documents": true
}`],notes:["The stale due_date from stage 8 has arrived. And the description ends in the portal's own ... at exactly 200 characters. The useful half of that notice never made it into the card. Two keys are left out of the block above to save space: ai_reasoning, which repeats the reason shown in stage 8 word for word, and fit_signals, which is an empty list."],tables:[]}],notes:[],then:"now go back with the cookies and fetch the real paperwork"},{n:"12",title:"Documents, page text, requirements",who:"2.85e enrich_docs.py · 2.87 requirements extraction · 2.875 dedup re-pass",summary:["This is where the 200-character wall is finally climbed. For each live YES bid with no documents yet, the enricher opens the solicitation page with the same saved cookies, takes every attachment link across every section, uploads the files, saves the whole page text, and looks for an email and a phone number.","Then the shared steps read those documents, pull out the requirements with the exact wording quoted, and run the merge check a second time now that blank fields have been filled."],cells:[{label:"Writes",paths:[{path:"bid-docs bucket · {cluster_id}/documents/{ts}-{name}",size:null},{path:"bid_documents · bid_page_text · bid_updates · bid_enrichment",size:null},{path:"bids.contact_email, bids.contact_phone",size:null},{path:"data/portals/requirements-manifest.json → bid_requirements",size:null}],blocks:[],notes:["Documents are not walled once we are logged in. The attachment links download over plain requests with the saved cookies. That is unusual for a login portal and it is why 3 of the 6 board cards carry documents at all."],tables:[]},{label:"How the six cards actually stand",paths:[],blocks:[],notes:["Half get paperwork, none get a person. Document capture works for 3 of 6. Contact capture returned nothing for all 6. The auto-generated runbook for this portal claims 100% contact coverage, measured on 14 July, when the portal had exactly one live bid. Do not trust that number."],tables:[[{header:!0,cells:["Card","Documents","Contact email"]},{header:!1,cells:["48171","yes","none"]},{header:!1,cells:["48363","no","none"]},{header:!1,cells:["47975","yes","none"]},{header:!1,cells:["48150","yes","none"]},{header:!1,cells:["48374","no","none"]},{header:!1,cells:["48375","no","none"]}]]}],notes:['Three quiet mismatches on this stage. The enricher asks the database for bids marked yes or maybe. But stage 10 only ever publishes yes, so the maybe half of that question can never match anything. The registry says this portal has no enrichment passes while the enrichment registry defines a real one; the runbook prints "enrich passes: none" because of it. And this whole pass was silently dead until 17 July: when this portal moved into the shared batch on 16 July, nobody noticed the enricher had stopped being called, and it was wired back in the next day.'],then:"what changed since last time, and did every step actually run?"},{n:"13",title:"Change watching, emails, and the run check",who:"2.88 watch_list_signals.py · bid_watch.py · new_bids_email.py · 2.88t pipeline_sentinel.py",summary:["Tonight's snapshot is compared against the last archived one to spot bids whose details moved. Then the shared watchers turn everything that changed into update rows and email digests, and a final check asks whether every step really ran for every portal."],cells:[{label:null,paths:[],blocks:[],notes:["The deadline watcher and the frozen date from stage 8 are looking at different things. The watcher compares snapshot to snapshot, so it would have caught Bid B's deadline moving from 27 July to 3 August. The verdict row that carries the wrong date to the board is never re-checked against the snapshot at all. One of them noticed. The other one is what the operator reads."],tables:[[{header:!1,cells:["Deadline moved","works. The one change signal that is live for this portal"]},{header:!1,cells:["Addendum posted","can never fire. The list card has no addendum counter"]},{header:!1,cells:["Status went back to open",'can never fire. The engine writes the word "Open" into every row by hand, so the field never changes']},{header:!1,cells:["Page-text publisher","does nothing here. It only publishes rows that carry a page-text field, and this portal's snapshot has none. Page text arrives through the enricher instead"]},{header:!1,cells:["Morning digest, watch digest, deadline alerts","dead until an email key is set in data/auth/resend.env"]},{header:!1,cells:["Run check","writes data/portals/sentinel.json; this portal is named in that script by name, as the failure it was hardened for"]}]]}],notes:[],then:null}],d=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["Descriptions stop at 200 characters. 181 of 381 snapshot rows are exactly 200 long; 179 of those end in the portal's own ...",`Both AI passes read a cut-off scope. The model doc's claim that the card holds "the full untruncated scope", and that no extra fetch is needed, is wrong. The full text only arrives later, through the document enricher, after the score is already set`]},{header:!1,cells:["A carried verdict row freezes its due date. Bid B's row still says 2026-07-27; the portal moved it to 2026-08-03 on 24 July","The board shows a top-scoring bid as already closed when it has six days left. The daily report shows the right date because it re-reads the snapshot; the board file does not. One row of 60 that night, and it is the 90-scorer"]},{header:!1,cells:["Two row shapes in one verdicts.json. Fresh rows carry bid_key and no title/buyer/date; carried rows carry title/buyer/date and no bid_key","39 of the 60 rows have no due date at all. Every reader must handle both shapes; nothing warns when one is missing a field"]},{header:!1,cells:["The archive files are cumulative, not daily. triage.json holds 381, verdicts.json holds 60","Never add scoring.yes across portals for a nightly total. For this portal that 5 is the running set of live YES bids, not tonight's 3"]},{header:!1,cells:["The login refresher cannot report failure. It prints errors and still exits successfully","A broken login and a broken website look identical. The only real check is whether the retried pull works, as it did at 17:51:10 that night"]},{header:!1,cells:["MAYBE never leaves the machine. Only yes is published for this portal","5 MAYBEs sat in the archive that night and reached nobody. It also makes the maybe half of the enricher's database question permanently unmatchable"]},{header:!1,cells:['Only one of three change signals can fire. Status is written as the literal word "Open" by the engine; there is no addendum counter on the card',"Deadline moves are caught. Addenda and reopenings are invisible"]},{header:!1,cells:["No shared safety net. Carry-forward is engine-internal; no _carryforward_audit.json exists in the folder","Correct as designed, but there is no second net. If the sweep breaks, the memory breaks with it, which is exactly what killed this portal for the three weeks between 21 June and 11 July"]},{header:!1,cells:["Three files in runs/ that no code writes. _be_chunk1.json (126 rows), _be_chunk2.json (125 rows), triage-input-aug.json (26 rows)","Scratch files an AI helper left behind on some earlier run. The 126+125 total matches no number in the funnel. Bid A appears inside _be_chunk1.json, so they are real data, just orphaned. Nothing reads them; nothing cleans them up"]},{header:!1,cells:["stats.json writes an empty endpoint while bids/index.json, written 11 minutes earlier, has the real address","The standardized report's Source line comes out blank. Still blank on 28 July, same as on 24 July"]},{header:!1,cells:[`Stale paperwork in five places. config.json says "standalone": true; the runbook says batch "standalone" and "enrich passes: none"; the runbook's own field map is all TODO`,"None of it changes behaviour. The real batch is portals and the real enrichment pass exists, but anyone reading the runbook is misled. Do not cite PORTAL.md for field provenance; it is an auto-generated draft"]},{header:!1,cells:["The model doc quotes the previous run. docs/portal-dataflow/bidexpress.md is written against 24 July: 370 / 314 / 56, 49 verdicts, 3 YES","Its stage shape still matches what ran on 28 July, but every count in it is one run behind. The numbers on this page come from the files, not from that doc"]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read off disk from the named file; every count traces to data/bidexpress/daily/2026-07-28/stats.json, a row count, a byte size, or a file timestamp. Where the stage model and the files disagreed, the files won and the page says so. Baseline map: docs/portal-dataflow/bidexpress.md (evidence-cited to file:line, written against the 24 July run). Companion page: Portal pedia · 02 (DemandStar)."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read off disk from the named file; every count traces to data/bidexpress/daily/2026-07-28/stats.json, a row count, a byte size, or a file timestamp. Where the stage model and the files disagreed, the files won and the page says so. Baseline map: docs/portal-dataflow/bidexpress.md (evidence-cited to file:line, written against the 24 July run). Companion page: Portal pedia · 02 (DemandStar).",c="docs/portal-dataflow/pedia-bidexpress.html",p={slug:e,title:t,eyebrow:s,headline:a,lede:n,funnel:o,funnel_note:i,legend:r,stages:l,sections:d,footer:h,source_page:c};export{p as default,s as eyebrow,h as footer,o as funnel,i as funnel_note,a as headline,n as lede,r as legend,d as sections,e as slug,c as source_page,l as stages,t as title};
