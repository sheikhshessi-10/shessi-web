const e="phbidding",t="PH Bidding Group: what happens to a bid, stage by stage",n="Portal pedia · 36",a="PH Bidding Group: what happens to a bid, from plan room to board",s="Every stage of one run, with a real record from the actual files at each step. Two bids are followed the whole way: one thrown out at triage, one that survives to the end of the portal's own night and then stops dead before it ever reaches the board. All data is from the run of 28 July 2026. Nothing on this page was typed by hand.",i=[{value:"82",label:"in snapshot"},{value:"64",label:"carried over"},{value:"18",label:"new tonight"},{value:"10",label:"open in snapshot"},{value:"3",label:"sent to the judge"},{value:"2",label:"maybe"},{value:"0",label:"yes"}],o=`Sources: data/phbidding/daily/2026-07-28/stats.json (470 bytes) for snapshot, carryover, new, open, skip and the scoring block, and data/phbidding/runs/judge-input-open.json (12,177 bytes, 3 rows) for how many bids the judge actually read. Careful with the "10 open" number: that is every OPEN bid sitting in the 82-row snapshot, not tonight's work. Only 3 of the 10 were still waiting for a verdict, so only 3 went to the AI. The other 7 already had one from an earlier night. Zero YES on this run.`,r=["Bid A · 20674: Lafayette County School District, Baseball & Softball Bleachers. Skipped, and skipped before tonight.","Bid B · 20688: Town of Georgetown, CDBG Drainage Improvements. Ends as MAYBE at score 52, and goes no further."],d=[{n:"0",title:"Is this portal even due tonight?",who:"P0 · scripts/portal_due.py --batch portals",summary:["This board is only read every third day. The gate looks at the newest folder name under data/phbidding/daily/ and compares it to today. If the last archive is younger than three days, nothing below this line runs at all.","A second portal, planhouseplanroom, reads the exact same project database under a different brand name, and it is read on the same nights: every archive folder this slug has written since 3 June 2026 exists under that slug too, the same dates all the way to 28 July. What differs is the login. The twin is registered as authenticated and has a password on file, so it can fetch the plan files; this one has none and cannot."],cells:[{label:"In → Out",paths:[{path:"data/portals/registry.json",size:"the row for this slug"},{path:"data/phbidding/daily/",size:"folder names, read as dates"},{path:"a printed list of due slugs",size:"no file is written"}],blocks:[`2026-07-10
2026-07-12
2026-07-13
2026-07-16
2026-07-20
2026-07-23
2026-07-28 <- this run`],notes:["33 archive folders in total. Note the last gap: 23rd to 28th is five days, not three. The cadence is a floor, not a promise."],tables:[]},{label:"The real registry row this gate reads",paths:[],blocks:[`{
 "slug": "phbidding",
 "label": "PH Bidding Group",
 "engine": "planhouse",
 "batch": "portals",
 "cadence_days": 3,
 "authed": false,
 "enrich_passes": ["planhouse docs (phbidding)"],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:['Remember carry_forward: "engine-internal". It decides what stage 9 does, which is nothing.'],tables:[]}],notes:[],then:"the slug is due, so one child agent is started for it"},{n:"1",title:"The dispatch",who:"P1 · Agent reading .claude/skills/phbidding-sweep/SKILL.md",summary:["The nightly orchestrator hands this portal to one child agent, five portals at a time. The child runs one script and then calls the two AI passes. If the child crashes, the roll-up marks this portal failed and the other portals keep going.","The twin, planhouseplanroom, is dispatched by a different skill, with its own scripts and its own AI calls. Same database, two separate sweeps on the same night."],cells:[{label:"In → Out",paths:[{path:".claude/skills/phbidding-sweep/SKILL.md",size:"the phase list the child follows"},{path:"data/phbidding/scripts/run_daily.py",size:"the only script this portal owns"},{path:"a running child agent",size:"no file"}],blocks:[],notes:[],tables:[]},{label:"The portal's real config",paths:[],blocks:[`{
 "slug": "phbidding",
 "name": "PH Bidding Group",
 "engine": "planhouse",
 "state": "MS",
 "entity_url": "https://www.phbidding.co/
 projects/public?status=bidding",
 "auth": "none",
 "onboarded": "2026-06-03"
}`],notes:["The engine name planhouse is shared code. The same file drives phbidding.co and planhouseplanroom.com. Only the host in entity_url differs."],tables:[]}],notes:[],then:"plain web pages, no login, no browser"},{n:"2",title:"Pull: walk the public list",who:"P1 · run_daily.py step 1 → ps.pull (engine planhouse)",summary:["It asks for page after page of the public bidding list and reads the cards. Each card gives a project number, a project name, a firm, a town, a bid date and a status line. It stops when a page adds nothing new. That night: 82 open projects.","What a card never gives is the scope. The description field comes back empty for every row at this stage. Scope only arrives later, and only for the few bids that survive triage."],cells:[{label:"In → Out",paths:[{path:"https://www.phbidding.co/projects/public?status=bidding&page=<N>",size:"HTML cards"},{path:"data/phbidding/bids/all-bids.json",size:"67,753 bytes · 82 rows · 15 fields"},{path:"data/phbidding/bids/index.json",size:"230 bytes"}],blocks:[`{
 "generated_at": "2026-07-28T20:52:19.079163+00:00",
 "snapshot_total": 82,
 "source": "phbidding",
 "engine": "planhouse",
 "endpoint": "https://www.phbidding.co/
 projects/public?status=bidding",
 "open_total": 82
}`],notes:[],tables:[]},{label:"Real record Bid A",paths:[],blocks:[`{
 "bid_id": "20674",
 "title": "0327.26.001 Lafayette County School
 District - Baseball & Softball Bleachers",
 "buyer": "MP Design Group",
 "location": "Oxford, MS (G-NR-E)",
 "state": "MS",
 "due_date": "2026-08-20",
 "due_date_raw": "8/20/26 2:00pm",
 "status": "Bids due in 23 days",
 "detail_url": "https://www.phbidding.co/
 projects/20674/details/032726001-lafayette-
 county-school-district-baseball-softball-
 bleachers",
 "description": "",
 "_detail_ok": false
}`],notes:[],tables:[]}],notes:[`The buyer field is not the buyer. "MP Design Group" is the engineering or architecture firm running the bid, because that is what the card's company line holds. The town or county actually paying is only in the free-text location and inside the notice body. Every later stage that says "buyer", including the AI, is looking at a design firm. Second surprise: this portal is registered as Mississippi and the metrics board hardcodes it as Mississippi, but 2 of the 82 rows in this snapshot are Alabama: project 20619 in Atmore and project 20616 in Mobile County.`],then:"tonight's 82 are compared against the 23rd of July's decisions"},{n:"3",title:"Diff: split old from new",who:"P2 · run_daily.py step 2 → ps.prep",summary:["The 82 rows are split in two by looking at the last archive's decisions. 64 bids were already decided on an earlier night and their old decision is copied straight across. 18 bids have never been seen. Only those 18 cost anything with the AI.","This copying is the first half of this portal's memory. The shared carry-forward script that other portals use does not touch this one. It does the same job here, inside the engine, at this exact line."],cells:[{label:"Out · four files",paths:[{path:"runs/triage-input.json",size:"3,839 bytes · 18 rows"},{path:"runs/triage-carryover.json",size:"8,917 bytes · 64 rows"},{path:"runs/judge-input.json",size:"54,726 bytes · 82 rows"},{path:"runs/_funnel.json",size:"153 bytes"}],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 82,
 "carryover_count": 64,
 "triage_input_count": 18,
 "prior_archive_ids_compared_against": 82
}`],notes:[],tables:[]},{label:"Real records Bid A · copied acrossBid B · new",paths:[],blocks:[`{
 "bid_id": "20674",
 "idx": 0,
 "title": "0327.26.001 Lafayette County School
 District - Baseball & Softball Bleachers",
 "decision": "SKIP",
 "reason": "bleachers, commodity/construction"
}`,`{
 "idx": 5,
 "bid_id": "20688",
 "title": "2024-458-00 Town of Georgetown -
 2024 CDBG Drainage Improvements",
 "buyer": "WGK Engineers, Inc",
 "state": "MS",
 "due_date": "2026-08-13"
}`],notes:["Bid A's SKIP reason was written on an earlier night. Tonight it was copied, not re-read."],tables:[]}],notes:[`The 82-row judge file is a template, not a prompt. runs/judge-input.json is built here, before anything has been fetched, so 80 of its 82 rows end after the words "RFP body (truncated to 6KB):" with nothing after them. Bid B's row is one of the 80. The file is not wasted. Stage 6 uses it as the row shape and refills the body from the freshly fetched snapshot. But read on its own it looks like 82 scoped bids and it is not.`],then:"18 titles go to the first AI pass"},{n:"4",title:"Pass 1: open it or drop it",who:"P3 · Agent max-triage",summary:['The AI gets six fields per bid and answers OPEN or SKIP with a short reason. Default is SKIP. It is judging almost entirely on the project name, because the scope does not exist yet and the "buyer" is a design firm.',"Result on the 18 new bids: 3 OPEN, 15 SKIP. Add the 64 copied decisions and the whole snapshot reads 10 OPEN, 72 SKIP."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"18 rows"},{path:"runs/triage-verdicts.json",size:"3,580 bytes · 18 rows"}],blocks:[],notes:["Bid A is not in this file. It was decided on an earlier night and copied at stage 3. Tonight it cost nothing at all: not a fetch, not a token. That is the point of the diff, and it is also why a bad SKIP is sticky: nothing re-reads it while the bid stays on the board."],tables:[]},{label:"Real record Bid B · opened",paths:[],blocks:[`{
 "bid_id": "20688",
 "idx": 5,
 "title": "2024-458-00 Town of Georgetown -
 2024 CDBG Drainage Improvements",
 "decision": "OPEN",
 "reason": "body: 'cleaning and grading of the
 existing ditch system'"
}`],notes:["All three OPEN reasons start with the word body: and quote the notice text. The other fifteen read off the title alone."],tables:[]}],notes:[`The agent quoted text that was not on disk yet. triage-input.json holds six fields per bid: id, index, title, buyer, state, due date. No body. Yet all three OPENs are justified with a quote from the notice: "body: 'Clearing and Grubbing (1 Acre)' - verbatim LGS verb", "body: 'cleaning and grading of the existing ditch system'", "body: 'grading of ditches, dredging of a pond'". Those three bids are not in the 23 July snapshot at all, so there was no older description to carry forward, and bids/all-bids.json only gained their bodies at 15:57:46, ten seconds after triage-verdicts.json was written at 15:57:36. So the agent must have read the live pages itself; no file records that it did.`],then:"only the OPENs get their detail page fetched"},{n:"5",title:"Enrich: go read the actual notice",who:"P4 · ps.enrich_opens(PORTAL, config, open_ids)",summary:["For each bid triage opened, eight threads fetch the public project page and pull out the advertised notice, the contact's name, email and phone, and the bid date shown on the page. All of this is free and anonymous. Only the plan files need a login, and this stage never tries.","If the notice block cannot be found in the markup, it falls back to scraping the whole page as text, so a layout change makes the description messy rather than empty."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json",size:"the OPEN ids"},{path:"https://www.phbidding.co/projects/<id>/details/<slug>",size:"one page per OPEN"},{path:"data/phbidding/bids/all-bids.json",size:"patched in place"}],blocks:[`description 5 of 82
contact_name 5 of 82
contact_email 5 of 82
contact_phone 4 of 82
page_text 4 of 82
_detail_ok 5 of 82
documents 0 of 82`],notes:["These are running totals, not tonight's work. The snapshot writer carries yesterday's enrichment forward into any field the fresh row leaves blank, so 5 filled rows is the sum of several nights. Tonight's pass touched the 3 new OPENs."],tables:[]},{label:"Real record Bid B · after enrichment",paths:[],blocks:[`{
 "bid_id": "20688",
 "buyer": "WGK Engineers, Inc",
 "location": "Town of Georgetown, MS (T-NR)",
 "due_date_raw": "8/13/26 10:00am",
 "status": "Bids due in 16 days",
 "description": "COMING SOON! NOTICE is hereby given
 that the Town of Georgetown, Mississippi, will
 receive written sealed bids until the hour of
 10:00 am local time on Thursday, July 30, 2026
 … The project includes the cleaning and grading
 of the existing ditch system in Georgetown, MS.
 Driveway and roadway culverts will be replaced
 as needed to match the grade of the designed
 ditch. …",
 "_detail_ok": true,
 "page_text": "Skip to main content
 info@phbidding.com 662-407-0193 Bidding
 Opportunities x Aug 13 Bids in 16 days … You
 need to register or login to view files and
 more project information. …",
 "contact_name": "Janet Holiday",
 "contact_email": "jholiday@wgkengineers.com",
 "contact_phone": "(601) 925-4444"
}`],notes:['The page itself says "You need to register or login to view files". That sentence is the document wall, captured verbatim in our own data.'],tables:[]}],notes:["77 of 82 bids never get a scope, ever. Only triage OPENs are fetched. A bid skipped on its title is skipped forever, on a title, with an empty description field sitting next to it. And the contact email is deliberately read only from the contacts block, so the site's own header address info@phbidding.com does not get scraped in as the buyer's contact."],then:"the judge's prompt is rebuilt from the now-filled snapshot"},{n:"6",title:"Build the Pass-2 input",who:"P4 · ps.build_judge_input_open(PORTAL)",summary:["Not every OPEN gets scored. This step collects only the ones that still need a verdict: tonight's new OPENs, plus any older OPEN that somehow never got judged, plus any already-judged bid whose details changed since last time.",'Tonight that is 3 bids out of 10 OPENs. The other 7 already had a verdict from an earlier night and are left alone. Their old score is merged back in at stage 8. This is why "10 open" and "10 scored" are not the same thing.'],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json",size:"3 OPEN"},{path:"runs/triage-carryover.json",size:"7 OPEN, all already judged"},{path:"runs/judge-input.json",size:"the row template"},{path:"bids/all-bids.json",size:"re-read for the fresh scope"},{path:"runs/judge-input-open.json",size:"12,177 bytes · 3 rows"}],blocks:[`20696 Multi-modal Railroad Siding Extension 3,583 chars
20688 Town of Georgetown CDBG Drainage 3,374 chars
20680 Pond 6 Remediation, Pine Golf Course 4,074 chars`],notes:[],tables:[]},{label:"Real record Bid B · the prompt body",paths:[],blocks:[`{
 "idx": 5,
 "bid_id": "20688",
 "title": "2024-458-00 Town of Georgetown -
 2024 CDBG Drainage Improvements",
 "buyer": "WGK Engineers, Inc",
 "state": "MS",
 "due_date": "2026-08-13",
 "description_full": "Title: 2024-458-00 Town of
 Georgetown - 2024 CDBG Drainage Improvements
 Buyer: WGK Engineers, Inc
 State: MS
 Closes: 2026-08-13
 Source URL: https://www.phbidding.co/projects/
 20688/details/2024-458-00-town-of-georgetown-
 2024-cdbg-drainage-improvements

 RFP body:
 COMING SOON! NOTICE is hereby given that the
 Town of Georgetown, Mississippi, will receive
 written sealed bids … The project includes the
 cleaning and grading of the existing ditch
 system in Georgetown, MS. …"
}`],notes:["Compare this with the same bid's row in judge-input.json at stage 3, where the body was empty. Same id, same file name family, two very different prompts."],tables:[]}],notes:[],then:"three bids, three scores"},{n:"7",title:"Pass 2: score it",who:"P5 · Agent max-bid-judge",summary:["The AI reads the notice and returns yes, maybe or no, with a score out of 100, a reason quoting the text, three match ratings, and two lists: what worries it and what fits.","Tonight's three came back 0 yes, 2 maybe, 1 no. Bid B is the top one at 52."],cells:[{label:"In → Out",paths:[{path:"runs/judge-input-open.json",size:"3 rows"},{path:"runs/judge-verdicts.json",size:"4,243 bytes · 3 rows"}],blocks:[`20696 no 15 Multi-modal Railroad Siding Extension
20688 maybe 52 Town of Georgetown CDBG Drainage
20680 maybe 49 Pond 6 Remediation, Pine Golf Course`],notes:["Look at the first red flag. The judge noticed that the notice body says bids are due 30 July while the field on the card says 13 August, and wrote that down rather than picking one. It also noticed the buyer field is the engineer, not the town. That is the stage-2 problem, caught downstream by the only reader that reads the whole notice."],tables:[]},{label:"Real record Bid B · MAYBE, 52",paths:[],blocks:[`{
 "bid_id": "20688",
 "title": "2024-458-00 Town of Georgetown -
 2024 CDBG Drainage Improvements",
 "buyer": "WGK Engineers, Inc",
 "state": "MS",
 "due_date": "2026-08-13",
 "would_lgs_bid": "maybe",
 "score": 52,
 "primary_reason": "\\"The project includes the
 cleaning and grading of the existing ditch
 system in Georgetown, MS\\" is a townwide
 drainage-channel clearing scope, the same shape
 as our channels-and-ditches debris wins. But
 culverts \\"replaced as needed to match the grade
 of the designed ditch\\" makes it a civil drainage
 contract, not a clearing contract.",
 "service_match": "adjacent",
 "scale_match": "borderline",
 "buyer_match": "core",
 "red_flags": [
 "due_date_conflict_body_says_2026-07-30_
 field_says_2026-08-13",
 "culvert_replacement_is_civil_construction_
 scope",
 "grading_to_designed_ditch_grade_not_
 vegetation_work",
 "small_town_cdbg_likely_low_scale",
 "section_3_local_hire_requirement",
 "ms_certificate_of_responsibility_and_
 nonresident_bidder_law",
 "buyer_field_is_engineer_not_owner_town_
 of_georgetown"
 ],
 "fit_signals": [
 "ditch_system_cleaning_townwide_not_
 single_site",
 "matches_channels_and_ditches_clearing_
 precedent",
 "town_buyer_is_core_lgs_type",
 "in_core_state_ms",
 "120_day_contract_term_defined"
 ],
 "kansas_city_risk": false,
 "closed_award": false
}`],notes:[],tables:[]}],notes:[],then:"tonight's 3 verdicts are merged with 7 old ones and written down"},{n:"8",title:"Compile: write tonight's archive",who:"P6 · ps.compile_archive(PORTAL, config)",summary:["Copied and new triage decisions are merged into one 82-row file. Then the 3 fresh verdicts are merged with the 7 still-valid ones from the last archive, giving 10 verdict rows. This merge is the second half of this portal's memory, and the reason it does not need the shared carry-forward script.","Each verdict row is also rewritten to carry both spellings of the same thing: would_lgs_bid and verdict, score and lgs_score, so a downstream reader that only knows one name cannot silently drop a bid."],cells:[{label:"The archive · data/phbidding/daily/2026-07-28/",paths:[],blocks:[],notes:["new-bids.json is not new bids. It is byte-for-byte identical to bids/all-bids.json: same 67,753 bytes, same 82 rows. Bid A, skipped weeks ago, sits inside it. The 18 genuinely new bids are only findable by comparing triage-input.json against the file. Anyone who reads this file by its name will over-count this portal.","Two rows carry a key nothing here writes. Projects 20374 and 20652 each carry a _first_judged date. compile_archive never writes that key. Something else has been run by hand against this portal's durable archive and left only the field behind."],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","82 rows, the whole snapshot","67,753 B"]},{header:!1,cells:["triage.json","82 decisions, tomorrow's memory","12,494 B"]},{header:!1,cells:["verdicts.json","10 rows: 3 new + 7 carried","9,872 B"]},{header:!1,cells:["stats.json","the funnel counts","470 B"]},{header:!1,cells:["report.md","human summary","1,323 B"]}]]},{label:"Real record Bid B in the archive",paths:[],blocks:[`{
 "bid_id": "20688",
 "title": "2024-458-00 Town of Georgetown -
 2024 CDBG Drainage Improvements",
 "buyer": "WGK Engineers, Inc",
 "state": "MS",
 "due_date": "2026-08-13",
 "would_lgs_bid": "maybe",
 "score": 52,
 "primary_reason": "…civil drainage contract,
 not a clearing contract.",
 "red_flags": ["due_date_conflict_body_says_
 2026-07-30_field_says_2026-08-13", …],
 "kansas_city_risk": false,
 "closed_award": false,
 "bid_key": "phbidding:20688",
 "verdict": "maybe"
}`,`## YES — Max would bid

_none_`],notes:["The two MAYBEs are listed below it with their reasons and links. That is the entire human-facing output of the night."],tables:[]}],notes:[],then:"the portal's own night is over, the shared machinery takes over"},{n:"9",title:"Carry-forward: skipped on purpose",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:[`Most portals get a safety net here: a shared script that rescues verdicts for bids that fell out of one night's pull. This portal is filtered out of that run, because its registry row says carry_forward: "engine-internal". The plain-word meaning: this portal already did it itself, twice.`,"Running the shared script on top would apply carry-forward a second time. So it is not run, and that is correct."],cells:[{label:"The proof it already happened, inside the engine",paths:[],blocks:[],notes:["The twin does it the other way. planhouseplanroom, which reads the same database, is set to orchestrator carry-forward, so its verdicts age out under a 90-day cap that this portal's never reach. Same projects, two different expiry rules, depending purely on which folder they came through."],tables:[[{header:!0,cells:["Half","Where","What it did tonight"]},{header:!1,cells:["Triage memory","stage 3, ps.prep","re-adopted 64 old OPEN/SKIP decisions from the 23 July archive"]},{header:!1,cells:["Verdict memory","stage 8, ps.compile_archive","merged 7 old verdicts in beside 3 new ones, giving 10 rows"]}]]}],notes:[],then:"the ledger takes the MAYBEs, the board does not"},{n:"10",title:"Ledger, report, fixture, and where Bid B dies",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared steps. The ledger walks every archive this portal ever wrote and keeps one entry per project. The report writer rewrites report.md into the layout every portal shares. The fixture dump turns YES bids into board cards.",'Bid B reaches the first, and stops at the third. The fixture dump takes only verdict "yes" for a non-federal portal. A MAYBE at 52 is archived, is listed in the ledger, is printed in the report, and never becomes a board row, never clusters, never emails anyone.'],cells:[{label:"Real record Bid B in the ledger",paths:[],blocks:[`{
 "portal": "phbidding",
 "bid_id": "20688",
 "title": "2024-458-00 Town of Georgetown -
 2024 CDBG Drainage Improvements",
 "buyer": "WGK Engineers, Inc",
 "state": "MS",
 "score": 52,
 "verdict": "maybe",
 "category": "",
 "reason": "\\"The project includes the cleaning
 and grading of the existing ditch system in
 Georgetown, MS\\" is a townwide drainage-channel
 clearing scope… makes it a civil drainage c",
 "close_date": "2026-08-13",
 "first_seen": "2026-07-28",
 "last_seen": "2026-07-28",
 "runs_seen": 1,
 "_first_judged": null
}`],notes:["From data/portals/cumulative-yes.json (1,599,603 bytes). The file is called cumulative-yes but this row is a maybe. 5 phbidding entries are in its live list; 4 of the 5 are maybes."],tables:[]},{label:"The board fixture, counted",paths:[],blocks:[],notes:["Nothing from the 28 July run reached the board. Zero YES means zero new cards. The single phbidding card in the fixture is project 20625, judged YES at 70 back on 10 July and last seen on the 23rd. It had already dropped out of this snapshot by the 28th. On this night, the whole portal produced two maybes and a report, and that was all."],tables:[[{header:!0,cells:["In portal-bids.json","Count"]},{header:!1,cells:["cards from every portal","1,470"]},{header:!1,cells:["cards from phbidding","1"]},{header:!1,cells:["cards from planhouseplanroom","7"]},{header:!1,cells:["Bid B (20688) present?","no"]},{header:!1,cells:["the other maybe (20680) present?","no"]}]]}],notes:[],then:"for the bids that do pass, the board is where the twin should collapse"},{n:"11",title:"Publish, cluster, dedup, and the doc pass that cannot run",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py · 2.85b planhouse_doc_capture.py",summary:["Cards are pushed to the shared database, keyed by portal plus source id. A project carried by both brands therefore lands as two rows. Clustering is the one step that puts them back together: it groups on normalized title plus state, and the two brands publish identical titles in Mississippi.","A documents pass is registered for this portal and dispatched every night. It asks for the phbidding login, finds none, prints a line and returns without opening a browser. The enrichment phase records it as fine."],cells:[{label:"Real card project 20625 · phbidding",paths:[],blocks:[`{
 "id": "9dd276f4199a8237",
 "portal": "phbidding",
 "source_bid_id": "20625",
 "title": "96866-072826 Residential Lots,
 Right-of-Way, and Vegetation Management
 Services",
 "buyer": "City of Jackson",
 "state": "MS",
 "score": 70,
 "verdict": "yes",
 "due_date": "2026-07-28",
 "contact_name": "Monica Oliver",
 "contact_email": "moliver@city.jackson.ms.us",
 "contact_phone": "601-960-1638",
 "has_documents": true
}`],notes:[],tables:[]},{label:"The same project via planhouseplanroom",paths:[],blocks:[`{
 "id": "688f61161eda650f",
 "portal": "planhouseplanroom",
 "source_bid_id": "20625",
 "title": "96866-072826 Residential Lots,
 Right-of-Way, and Vegetation Management
 Services",
 "buyer": "Jackson, MS (T-NR-E)",
 "state": "MS",
 "score": 82,
 "verdict": "yes",
 "due_date": "2026-07-23",
 "contact_name": null,
 "contact_email": null,
 "contact_phone": null,
 "has_documents": true
}`],notes:["One project. Two cards. Two scores, 70 and 82. Two buyers, two due dates, and only one of them carries the contact. Both are sitting in the fixture right now."],tables:[]}],notes:["The same night, the same two projects, two different answers. On 28 July this portal judged 20688 a maybe at 52 and 20680 a maybe at 49. The twin, reading the same database the same night, judged 20688 a no at 28 and 20680 a no at 25. The verdict is behaving like a property of which folder the bid came through, not of the bid. And because neither side reached YES, neither published, so clustering never even got the chance to notice they were the same job.",`The documents pass is registered and inert. There is no phbidding password: data/auth/ holds a credentials file for the twin but none for this portal, and the shared login sheet's "PH Bidding Group" row has an empty username and password. The pass prints no creds for phbidding — skipping doc pass and returns clean, so the run records it as OK. The one thing that would turn it on is filling that row in. One caveat worth stating: the credential lookup checks a cloud table first, which cannot be read from the filesystem, so the evidence for "no credentials" is local only.`],then:"what do the bid documents demand?"},{n:"12",title:"Requirements: read from files this portal does not have",who:"2.87 · extract_doc_text.py → build_bidpack.py → requirements-extractor → apply_requirements.py",summary:["This step reads the text out of each published group's documents and asks an agent what the bid demands: bonds, licences, insurance, pre-bid meetings. It runs every night whether or not enrichment went well.","This portal contributes no files at all. Its snapshot carries zero documents on all 82 rows, and its own document pass cannot log in. Anything its bids get comes from the twin's logged-in capture, or from some other portal that landed in the same group."],cells:[{label:"In → Out",paths:[{path:"the shared document store + file bucket",size:"whatever the group has"},{path:"data/portals/requirements-manifest.json · requirements-input.json",size:null},{path:"the shared bid_requirements table",size:"one row per group"}],blocks:[],notes:[`Whether a phbidding bid gets requirements is decided by clustering, not by this portal. If the deterministic title match joined it to the twin's group, it inherits the twin's files. If not, it gets a neutral "no material" row so the board never shows a blank pretending to be an answer. Worth noting against this: the portal runbook at data/phbidding/PORTAL.md claims "document coverage 100%", measured against one surfaced bid. That number cannot mean what it looks like it means.`],tables:[]}],notes:[],then:"now that blanks are filled, look for duplicates again"},{n:"13",title:"Dedup, second pass",who:"2.875 · llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["Enrichment and the requirements step have just filled in buyers and due dates that were empty an hour ago. That makes pairs comparable that were not comparable before, so the duplicate hunt runs again over only that residue.",'For this portal that second pass is the safety net for the twin. If the plain title match missed a pair, the AI judge can still say "these are the same", and that answer is stored and re-applied as a forced join on every future run.'],cells:[{label:"What the overlap sheet already knows",paths:[],blocks:[],notes:["Measured on the day, not assumed. phbidding's snapshot holds 82 projects, the twin's holds 83, and 82 of the 82 project numbers appear on both. The titles match 82 of 82 too. The twin's one extra is project 20625, the bid that closed at 3:30pm that day and had already dropped off this portal's list. Read plainly: this portal found nothing the twin did not already have. Everything before stage 11 counts those 82 projects twice, and nothing anywhere checks that the two halves actually ended up in the same group."],tables:[[{header:!0,cells:["Pair","Shared normalized titles"]},{header:!1,cells:["phbidding ↔ planhouseplanroom","82 · the only pair in the file that names phbidding"]}]]}],notes:[],then:"what changed since last time, and who needs telling"},{n:"14",title:"Watch, digests, health check",who:"2.88 · watch_list_signals.py · publish_page_text.py · bid_watch.py · new_bids_email.py · alerts_engine.py · contracts_digest.py · pipeline_sentinel.py",summary:["The last shared step compares tonight's snapshot with the last archived one and records the changes the list page itself shows: a bid date that moved, a status that flipped. Then the emails go out and the health sentinel checks that every portal finished every phase.","This portal's watch mode is none, so there is no deeper page re-capture. Addenda on this board sit behind the login, so the free list-level signal is all there is."],cells:[{label:null,paths:[],blocks:[],notes:["Nothing to send, anyway. The discovery email lists new YES bids. There were none. Even with a working key, this portal's 28 July output would have been silent."],tables:[[{header:!1,cells:["List-level change watch (watch_list_signals.py)","works, and runs over this slug even on days it did not sweep, where it simply finds nothing changed"]},{header:!1,cells:["Watch v2 page re-capture",'off, registry says watch: "none"']},{header:!1,cells:["Page text into the shared store","works, but only 4 of 82 rows carry any page text to send"]},{header:!1,cells:["Discovery and deadline emails","silent until an email API key exists in data/auth/resend.env"]},{header:!1,cells:["Sentinel","writes data/portals/sentinel.json for every portal"]}]]}],notes:[],then:null}],l=[{heading:"The quirks that bite, all on one card",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["It is the same database as planhouseplanroom, under a second brand","82 of 82 project numbers and 82 of 82 titles are shared. It adds nothing. Every stage before publishing counts each job twice, and only title-plus-state clustering pulls it back to one, with no check anywhere that the collapse happened"]},{header:!1,cells:["The same job can get two different verdicts on the same night","28 July: 20688 was maybe 52 here and no 28 on the twin; 20680 was maybe 49 here and no 25 there. Project 20625 sits on the board twice at 70 and 82. Project 20423 sits in the ledger twice at 45 and 52"]},{header:!1,cells:["buyer is the engineer or architect, never the owner",'"MP Design Group", "WGK Engineers, Inc". The AI scores buyer-fit against a design firm, and the judge itself flags it: buyer_field_is_engineer_not_owner_town_of_georgetown']},{header:!1,cells:["new-bids.json holds the whole snapshot, not the new bids","byte-identical to all-bids.json, 82 rows, weeks-old skips included. Read by its name, it reports 82 new bids where there were 18, more than four times too many"]},{header:!1,cells:["MAYBE verdicts never leave the folder",`the fixture dump takes only "yes" for a non-federal portal, so the night's two best bids reached the ledger and the report and stopped there. Zero YES that night means zero cards, zero clustering, zero email`]},{header:!1,cells:["Only triage OPENs ever get a scope","77 of 82 rows have an empty description. A bid dropped on its title is never looked at again while it stays on the board"]},{header:!1,cells:["The registered documents pass cannot log in","no phbidding credentials exist locally; it prints no creds for phbidding — skipping doc pass and returns, and the run records it as OK. 0 of 82 rows carry documents"]},{header:!1,cells:["Plan files are login-walled, and view-only even then","the twin's working pass has to render the spec set page by page through the portal's own PDF viewer, because the download link refuses"]},{header:!1,cells:["Two verdict rows carry _first_judged, which nothing here writes","projects 20374 and 20652. A hand-run script has written into this portal's durable archive and left no record of which one"]},{header:!1,cells:["Pass 1 fetches pages nothing records","all three OPEN reasons on 28 July begin body: and quote the notice, but triage-input.json carries no body, the three bids are absent from the 23 July snapshot, and their descriptions only reached all-bids.json ten seconds after the triage answers were written. The agent read the live pages itself, and no file logs that it did"]},{header:!1,cells:["Registered as Mississippi, but not only Mississippi","2 of 82 rows are Alabama (Atmore, and Mobile County). The metrics board hardcodes the state label as MS"]},{header:!1,cells:["The written stage model is stale",'docs/portal-dataflow/phbidding.md is anchored on the 23 July run throughout: carryover 72, new 10, "1 yes / 0 maybe / 8 no". The files on disk say 64, 18, and 0 / 2 / 8. Regenerate it before quoting a number out of it']},{header:!1,cells:["Cadence 3 days is a floor, not a promise","the archive gap from 23 to 28 July was five days, and the twin sweeps on exactly the same nights, so nothing covered that gap either. The twin still sees the same 82 projects and can log in for the files, which is the argument for retiring this slug"]}]],paragraphs:[`Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to data/phbidding/daily/2026-07-28/stats.json, a row count, or a byte size in docs/portal-dataflow/pedia-inspect/phbidding.json. Both tracer bids were found. The inspect file's tracer_notes list is empty. But the bid filed under its "yes" slot is a MAYBE at 52, because the run produced no YES at all. Baseline map: docs/portal-dataflow/phbidding.md (evidence-cited to file:line, and stale on every count). Companion page: Portal pedia · 02 (DemandStar).`]}],h=`Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to data/phbidding/daily/2026-07-28/stats.json, a row count, or a byte size in docs/portal-dataflow/pedia-inspect/phbidding.json. Both tracer bids were found. The inspect file's tracer_notes list is empty. But the bid filed under its "yes" slot is a MAYBE at 52, because the run produced no YES at all. Baseline map: docs/portal-dataflow/phbidding.md (evidence-cited to file:line, and stale on every count). Companion page: Portal pedia · 02 (DemandStar).`,c="docs/portal-dataflow/pedia-phbidding.html",p={slug:e,title:t,eyebrow:n,headline:a,lede:s,funnel:i,funnel_note:o,legend:r,stages:d,sections:l,footer:h,source_page:c};export{p as default,n as eyebrow,h as footer,i as funnel,o as funnel_note,a as headline,s as lede,r as legend,l as sections,e as slug,c as source_page,d as stages,t as title};
