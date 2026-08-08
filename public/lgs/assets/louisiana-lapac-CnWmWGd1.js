const e="louisiana-lapac",t="Louisiana LaPAC: what happens to a bid, stage by stage",a="Portal pedia · 24",s="Louisiana LaPAC: a night where the board barely moved",n="Every stage of the run of 28 July 2026, with a real record read off disk at each step. The honest headline is not the two YES bids. It is that 89 of the 109 bids on the board were already decided, only 20 were new, and only 2 bids reached the scoring agent all night. The score-90 bid the report leads with was judged on an earlier run and simply copied forward.",o=[{value:"109",label:"in snapshot"},{value:"89",label:"already decided"},{value:"20",label:"new tonight"},{value:"8",label:"triage says open"},{value:"101",label:"triage says skip"},{value:"2",label:"yes"},{value:"0",label:"maybe"},{value:"6",label:"no"}],r="Source: data/louisiana-lapac/daily/2026-07-28/stats.json (474 bytes) and data/louisiana-lapac/bids/all-bids.json (109 rows, 85,663 bytes). Read the triage row carefully: 8 OPEN and 101 SKIP add up to 109, the whole board, not the night's AI work. The agent only ever saw the 20 new bids. Same trap in the score row: 2 YES, 0 MAYBE and 6 NO add up to 8 standing verdicts, of which only 2 were written that night. One YES was earned that night at score 62. The other, at score 90, first appears in data/louisiana-lapac/daily/2026-07-20/verdicts.json.",i=["Bid A · 3000026477 · Inmate Clothing, State Procurement. Ends as SKIP.","Bid B · JPP-BidEvent#48 · emergency tree and debris, Jefferson Parish. On the board as YES, score 90.","Both were decided on earlier runs and re-adopted tonight."],l=[{n:"0",title:"Is this portal due tonight?",who:"scripts/portal_due.py --batch portals",summary:["LaPAC does not run every night. It runs every third night. The gate looks at the newest dated folder under data/louisiana-lapac/daily/; if it is 3 or more days old, the slug is printed as due and the sweep starts. There are 30 such folders on disk."],cells:[{label:"In",paths:[{path:"data/portals/registry.json",size:"the slug's row"},{path:"data/louisiana-lapac/daily/",size:"30 dated folders"}],blocks:[],notes:["Cadence is edited by the operator in the PortalPro Matrix and lives in Supabase; registry.json is the offline fallback."],tables:[]},{label:"The registry row that governs everything below",paths:[],blocks:[`{
 "slug": "louisiana-lapac",
 "label": "Louisiana LaPAC",
 "engine": "lapac",
 "batch": "portals",
 "cadence_days": 3,
 "authed": false,
 "enrich_passes": [],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:[],tables:[]}],notes:[],then:"due, so one child agent is sent for this portal"},{n:"1",title:"The child sweep starts",who:"Agent reading .claude/skills/louisiana-lapac-sweep/SKILL.md",summary:["The orchestrator sends one child agent per due portal, five at a time, and waits for the batch before starting the next. If this child fails, the roll-up marks the portal failed and the other portals keep going.","The child's whole job is to run one script and then answer two AI questions when that script asks for them."],cells:[{label:"Out",paths:[{path:"python data/louisiana-lapac/scripts/run_daily.py",size:null}],blocks:[],notes:["The script owns only the order of steps and the exit code: 0 nothing new, compiled from memory · 2 the child owes an AI answer · 1 the pull broke."],tables:[]},{label:"data/louisiana-lapac/config.json (925 bytes)",paths:[],blocks:[`{
 "slug": "louisiana-lapac",
 "name": "Louisiana LaPAC",
 "engine": "lapac",
 "state": "LA",
 "category": "state_procurement",
 "entity_url": "https://wwwcfprd.doa.louisiana.gov/
 OSP/LaPAC/pubMain.cfm",
 "auth": "none",
 "public_view": true,
 "max_depts": 200,
 "lgs_fit": "high",
 "notes": "Louisiana Procurement and Contract
 network (Office of State Procurement,
 ColdFusion). Public, no login. Authoritative
 open set is the UNION of per-department
 dspBid.cfm pages (the all-departments srchopen
 view is capped/incomplete …"
}`],notes:['The same note ends: "Scope text lives in linked PDFs; title+agency drive Pass-1."'],tables:[]}],notes:[],then:"one page per government department, no login anywhere"},{n:"2",title:"Pull",who:"run_daily.py step 1 · ps.pull → engine lapac.py",summary:[`LaPAC's own "all departments" page is capped and quietly misses whole agencies, so we never use it. Instead the engine reads the department directory, learns which departments have open bids right now, and fetches one page each. The union of those pages is the day's open set.`,'That night the directory reported 39 departments with open bids. All 39 were fetched, and the log shows 6 of them reporting "0 open". 109 bids survived after cancelled and past-due rows were dropped.'],cells:[{label:"In → Out",paths:[{path:"dspBid.cfm?search=department&term=<N>",size:"39 pages, static HTML"},{path:"open folders/_lib/engines/lapac_depts.json",size:"term → department name"},{path:"bids/all-bids.json",size:"85,663 bytes · 109 rows"},{path:"bids/index.json",size:"328 bytes"},{path:"logs/pull_log.txt",size:"one line per department"}],blocks:[`20:22:17 LaPAC pull starting · host=https://wwwcfprd.doa.louisiana.gov
 · today=2026-07-28
20:22:17 deptbids.cfm reports 39 departments with open bids
20:22:24 term= 1 [State Procurement *** ] 33 open (running total 33)
20:23:00 term= 185 [Non State - St. Tammany Parish Government ] 11 open
 (running total 106)
20:23:02 term= 191 [Non State - New Orleans Regional Transit A] 3 open
 (running total 109)
20:23:03 wrote 109 open bids -> …\\bids\\all-bids.json`],notes:["The log carries no warning lines that night: no department page failed, no department term was missing from the name map, no past-due row survived."],tables:[]},{label:"Real record Bid A",paths:[],blocks:[`{
 "bid_id": "3000026477",
 "title": "Inmate Clothing - DOC-PE",
 "buyer": "State Procurement ***",
 "agency": "State Procurement ***",
 "dept_term": "1",
 "status": "Open",
 "due_date": "2026-07-28",
 "due_date_raw": "07/28/2026",
 "posting_date": "2026-07-14",
 "state": "LA",
 "detail_url": "https://wwwcfprd.doa.louisiana.gov/
 osp/lapac/agency/pdf/9033800.pdf",
 "description": "",
 "_detail_ok": false
}`],notes:["Thirteen fields and no scope. That is everything a LaPAC list page gives. _detail_ok: false here does not mean a fetch failed. It is a placeholder stamped on every row at pull time, and it stays false until something reads the PDF."],tables:[]}],notes:["Two things this portal never puts on the list page. There is no scope text and there is no HTML detail page. The only scope that exists is inside the linked PDF, and reading a PDF costs money and time, so it happens later and only for a few bids. buyer is not a person and not scraped from the page either: it is the department name looked up from a static map. That map held for every one of the 39 terms this night, so 0 of 109 rows had a blank buyer."],then:"today's board is compared against the last archived night"},{n:"3",title:'Split into "already decided" and "new"',who:"run_daily.py step 2 · ps.prep",summary:["The snapshot is checked against the last archive, daily/2026-07-23/triage.json, which is the newest dated folder before this one and holds 98 decisions. That is where the 98 in the funnel file below comes from. A bid decided on a past day keeps that decision for free. Only bids never seen before go to the AI.","That is where the night's real shape comes from: 89 carried, 20 new. The script also builds a judge row for every one of the 109, ready in case it is needed."],cells:[{label:"Out",paths:[{path:"runs/triage-input.json",size:"4,469 bytes · 20 rows"},{path:"runs/triage-carryover.json",size:"12,032 bytes · 89 rows"},{path:"runs/judge-input.json",size:"78,038 bytes · 109 rows"},{path:"runs/_funnel.json",size:"154 bytes"}],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 109,
 "carryover_count": 89,
 "triage_input_count": 20,
 "prior_archive_ids_compared_against": 98
}`],notes:[],tables:[]},{label:"Bid A, carried for free Bid A",paths:[],blocks:[`{
 "bid_id": "3000026477",
 "decision": "SKIP",
 "reason": "inmate clothing, commodity"
}`,`{
 "idx": 70,
 "bid_id": "923456-26-25-1",
 "title": "Autumn Wind Ln Drainage",
 "buyer": "Non State - St. Tammany Parish
 Government",
 "state": "LA",
 "due_date": "2026-08-11"
}`],notes:["Six fields. No scope, because no scope exists yet. This is the entire brief Pass 1 gets."],tables:[]}],notes:["This is half one of the memory. LaPAC does its own carry-forward here, inside the sweep, instead of leaving it to the shared script that runs later. Stage 8 does the other half. If the prior archive were unreadable, it would be treated as empty and all 109 bids would be re-triaged as new."],then:"20 titles go to the first AI pass"},{n:"4",title:"Triage: worth a real look, or not",who:"Agent max-triage · Pass 1",summary:["The agent reads a title and a department name and answers OPEN or SKIP. The default is SKIP. LaPAC titles are short, so this decision is made on very little.","Of the 20 new bids: 18 SKIP, 2 OPEN. Both OPENs are St. Tammany Parish drainage jobs. The 8 OPENs the report shows are these 2 plus 6 opened on earlier nights."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"20 rows"},{path:"runs/triage-verdicts.json",size:"3,281 bytes · 20 rows"}],blocks:[],notes:["For a SKIP, this is the end. Nothing later reopens it, no PDF is ever fetched for it, and it costs nothing beyond one title read. 101 of the 109 bids on the board sat in that state that night."],tables:[]},{label:"Real records rejectedopened",paths:[],blocks:[`{
 "idx": 26,
 "bid_id": "3000026541",
 "title": "DOTD PVC & Duct(S45)",
 "decision": "SKIP",
 "reason": "commodity materials purchase,
 no work verb"
}`,`{
 "idx": 70,
 "bid_id": "923456-26-25-1",
 "title": "Autumn Wind Ln Drainage",
 "decision": "OPEN",
 "reason": "parish drainage/ditch work,
 LGS shape"
}`],notes:[],tables:[]}],notes:[],then:"only the freshly opened bids get their PDF read"},{n:"5",title:"Go read the PDF",who:"ps.enrich_opens → lapac.enrich_details",summary:["This is the one stage that can give a LaPAC bid a scope. For each bid just triaged OPEN whose link ends in .pdf, the engine downloads the file, pulls out up to 6,000 characters of text into description, registers the PDF as a document, and picks an email and a phone number out of the text.","The log is blunt about how small this is: 2 PDFs fetched, on a night with 8 OPEN bids."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json",size:"the 2 new OPEN ids"},{path:"bids/all-bids.json",size:"description, documents, contact_email, contact_phone"}],blocks:[`20:26:09 enrich_details: fetching 2 LaPAC solicitation PDFs
20:26:19 enrich_details: 2/2 enriched, 2 PDF docs`,`923456-26-24-1 6000 chars
923456-26-25-1 6000 chars
923456-26-26-1 6000 chars
923456-26-37-2 6000 chars
JPP-BidEvent#48 3210 chars
50007-RQ26-001 0 chars (has a .pdf link)
923456-26-35-2 0 chars (has a .pdf link)
20008-A26-0805 0 chars (has a .pdf link)`],notes:[],tables:[]},{label:"What enrichment added to Bid B Bid B",paths:[],blocks:[`{
 "bid_id": "JPP-BidEvent#48",
 "description": "ADVERTISEMENT FOR BIDS
 BID EVENT #48
 Sealed Bids will be received electronically…
 Two (2) Year Contract to Provide Labor,
 Materials, and Equipment Necessary for
 Emergency Tree Removal, Stump (Rootball)
 Removal, Hazardous Limb Removal and Hauling
 Tree Debris for the Jefferson Parish
 Department of Parkways…",
 "_detail_ok": true,
 "documents": [
 {
 "file_name": "Two (2) Year to Provide Labor,
 Materials, & Equip. Necessary for Emerg.pdf",
 "file_url": "https://wwwcfprd.doa.louisiana.gov/
 osp/lapac/agency/pdf/9035500.pdf",
 "file_description": ""
 }
 ],
 "contact_phone": "504-364-2678"
}`],notes:["The whole character of this portal in one record. A bare title on the list page becomes a real scope only after somebody pays to open a PDF."],tables:[]}],notes:["Three OPEN bids on this board have a PDF link and no text, and nothing will ever fetch them again. Each of the three had a full 6,000-character capture once, on the day it was opened: 923456-26-35-2 on 5 July, 50007-RQ26-001 on 7 July, 20008-A26-0805 on 13 July. On every run after, all three read zero. Everything captured from 20 July onward has survived three runs unharmed, so whatever caused the loss appears to have stopped. What has not been fixed is the repair path: this stage only visits the ids handed to it, which are that night's new OPENs, and LaPAC is deliberately left out of the zero-document backstop (scripts/backfill_missing_docs.py:27). Text lost here is lost for good."],then:"the scoring queue is rebuilt from the freshly enriched snapshot"},{n:"6",title:"Who still needs a score?",who:"ps.build_judge_input_open",summary:["This step collects tonight's OPENs plus any older OPEN that never got scored, then re-reads the snapshot so the PDF text just extracted is in the prompt. It exists to fix an old bug where a bid opened on one night and missed by the scorer sat unscored forever.","That night it returned exactly 2 rows. The other 6 OPEN bids already held a standing verdict, so they were not re-asked."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json + triage-carryover.json",size:null},{path:"daily/2026-07-23/verdicts.json",size:"who already has a score"},{path:"bids/all-bids.json",size:"for the PDF text"},{path:"runs/judge-input-open.json",size:"13,531 bytes · 2 rows"}],blocks:[],notes:["Two rows, 13,531 bytes. Almost all of that is PDF text: the two description_full fields are 6,200 and 6,209 characters long."],tables:[]},{label:"Real record, one of the two",paths:[],blocks:[`{
 "idx": 70,
 "bid_id": "923456-26-25-1",
 "title": "Autumn Wind Ln Drainage",
 "buyer": "Non State - St. Tammany Parish
 Government",
 "state": "LA",
 "due_date": "2026-08-11",
 "detail_url": "https://wwwcfprd.doa.louisiana.gov/
 osp/lapac/agency/pdf/9039300.pdf",
 "description_full": "Title: Autumn Wind Ln Drainage
 Buyer: Non State - St. Tammany Parish Government
 State: LA
 Closes: 2026-08-11
 Source URL: …/9039300.pdf

 RFP body:
 1.1 Background
 The Parish requests a Contractor to improve
 drainage by removing and replacing drainp…"
}`],notes:[],tables:[]}],notes:[],then:"two bids, and only two, are scored"},{n:"7",title:"The score",who:"Agent max-bid-judge · Pass 2",summary:["The scoring agent reads the PDF scope and answers yes, maybe or no, with a number out of 100 and a reason. Two bids in, two answers out: one yes at 62, one no at 22.",'Look at what separated them. Both are called "drainage" and both come from the same parish. One is ditch cleaning and grading, which is LGS dirt work. The other is resealing joints in buried pipe, which is a different trade entirely. Only the PDF text could tell them apart.'],cells:[{label:"In → Out",paths:[{path:"runs/judge-input-open.json",size:"2 rows"},{path:"runs/judge-verdicts.json",size:"1,959 bytes · 2 rows"}],blocks:[`{
 "bid_id": "923456-26-26-1",
 "title": "Lake Superior Dr Drainage Repair",
 "would_lgs_bid": "no",
 "score": 22,
 "category": "non-fit - subsurface pipe
 rehabilitation (specialty trenchless trade)",
 "primary_reason": "Scope 2.1 is 'cleaning,
 repairing, and resealing existing pipe joints
 in the existing subsurface' - that is specialty
 underground pipe rehab… There is no ditch work,
 no grading, no vegetation and no debris anywhere
 in the scope, so despite the 'drainage' title
 this is not LGS work.",
 "red_flags": [
 "wrong_vertical_subsurface_pipe_joint_resealing",
 "no_vegetation_debris_or_ditch_scope_in_sow",
 "title_reads_drainage_but_scope_is_
 specialty_pipe_rehab",
 "license_required_highway_street_bridge_
 construction"
 ]
}`],notes:[],tables:[]},{label:"The night's only earned YES score 62",paths:[],blocks:[`{
 "bid_id": "923456-26-25-1",
 "title": "Autumn Wind Ln Drainage",
 "buyer": "Non State - St. Tammany Parish
 Government",
 "state": "LA",
 "would_lgs_bid": "yes",
 "score": 62,
 "category": "Category 6 - Specialty/Adjacent
 (drainage ditch cleaning, shaping & grading)",
 "primary_reason": "Scope 2.1 is half real LGS
 dirt work - 'cleaning, shaping, and grading
 ditches along Autumn Wind Ln' is the same
 channel-and-ditch maintenance we run on storm
 and drainage-district contracts - bundled with
 'removing and replacing drainpipe', which is
 civil pipe work we would sub or price around.
 Right shape, small package, so it surfaces for
 the operator rather than gets tossed.",
 "red_flags": [
 "hybrid_includes_drainpipe_replacement",
 "low_scale_inferred_single_site",
 "low_scale_inferred_rfq_informal",
 "license_required_highway_street_bridge_
 construction",
 "short_duration_45_calendar_days",
 "hand_delivery_or_certified_mail_only_
 no_e_submission"
 ]
}`],notes:[],tables:[]}],notes:[],then:"tonight's two answers are merged with the standing ones"},{n:"8",title:"Write the night down",who:"ps.compile_archive",summary:["Carryover and new triage are merged into one file of 109 decisions. Yesterday's still live verdicts are merged with tonight's two into one file of 8. Every verdict row is rewritten so it carries both spellings of the same answer, and the five daily files are written.","This is where the score-90 bid gets onto tonight's report without being scored tonight. Its verdict is copied from the previous archive because the bid is still on the board."],cells:[{label:"Out · data/louisiana-lapac/daily/2026-07-28/",paths:[],blocks:[`yes 90 JPP-BidEvent#48 carried from 07-20
yes 62 923456-26-25-1 scored tonight
no 30 20008-A26-0805 carried
no 28 50007-RQ26-001 carried
no 25 923456-26-24-1 carried
no 25 923456-26-37-2 carried
no 22 923456-26-26-1 scored tonight
no 8 923456-26-35-2 carried`],notes:[],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","109 rows, the whole snapshot","85,663 B"]},{header:!1,cells:["triage.json","109 decisions, tomorrow's memory","15,930 B"]},{header:!1,cells:["verdicts.json","8 standing verdicts","8,548 B"]},{header:!1,cells:["stats.json","the funnel counts","474 B"]},{header:!1,cells:["report.md","human summary","1,538 B"]}]]},{label:"Real record Bid B · as the archive keeps it",paths:[],blocks:[`{
 "bid_id": "JPP-BidEvent#48",
 "title": "Two (2) Year to Provide Labor,
 Materials, & Equip. Necessary for Emerg",
 "buyer": "Non State - Jefferson Parish
 Purchasing Department",
 "state": "LA",
 "would_lgs_bid": "yes",
 "score": 90,
 "category": "Category 1/4 - emergency tree/stump/
 debris, multi-year parish contract",
 "primary_reason": "Two-year Jefferson Parish
 contract for emergency tree removal, stump/
 rootball removal, hazardous limb removal, and
 hauling of tree debris for the Parkways
 Department - a direct match to LGS's core
 tree/debris trade with multi-year scale.",
 "red_flags": [],
 "verdict": "yes",
 "lgs_score": 90,
 "reasoning": "Two-year Jefferson Parish contract
 for emergency tree removal…"
}`],notes:["Every answer is written twice on purpose: would_lgs_bid and verdict, score and lgs_score. A downstream reader that only knows one spelling cannot silently drop a YES."],tables:[]}],notes:["This is half two of the memory. Stage 3 re-adopts old triage decisions, stage 8 re-adopts old scores. Between them the portal carries its own past forward and never asks the shared carry-forward script for help. That matters for the next card."],then:"the portal's own work is done, the shared machinery takes over"},{n:"9",title:"Shared carry-forward: skipped on purpose",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:['The shared safety net rescues verdicts for portals that forget them. It only touches portals whose registry entry says carry_forward: "orchestrator". LaPAC says "engine-internal", so the script filters it out and writes nothing.',"That is correct, not a gap. Stages 3 and 8 already did the same job inside the sweep. Running it again here would apply carry-forward twice to the same bids."],cells:[{label:"In → Out",paths:[{path:"data/portals/registry.json",size:"reads carry_forward for this slug"},{path:"nothing written for louisiana-lapac",size:null}],blocks:[],notes:['Nothing guards that value against the sweep. The only check is that it reads as one of three legal words — orchestrator, engine-internal or none (scripts/portal_registry.py:111). Nothing compares it against what the sweep actually does. Flip this slug to "orchestrator" and leave stages 3 and 8 in place, and carry-forward runs twice with no warning printed anywhere.'],tables:[]}],notes:[],then:"the ledger, the report and the hand-off file"},{n:"10",title:"Ledger, report, and leaving the portal folder",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared scripts in a row. The first folds every YES this portal ever produced into the all-portal ledger. The second throws away the report compile just wrote and rewrites it in the one layout every portal shares. The third is the real hand-off: this portal's YES bids stop being portal-shaped and become board cards.","The timestamps on disk show the rewrite plainly. The snapshot was written at 20:23:03, the stats at 20:30:16, and the report says it was regenerated at 22:37:27."],cells:[{label:"Out",paths:[{path:"data/portals/cumulative-yes.json + .md",size:null},{path:"daily/2026-07-28/report.md",size:"1,538 bytes, overwritten"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"2,153,413 bytes · 1,470 cards"}],blocks:[`- Snapshot: **109** open bids
- Carryover: 89 · NEW today: 20
- Triage: 8 OPEN / 101 SKIP
- Scored: **2 YES / 0 MAYBE / 6 NO**`],notes:[],tables:[]},{label:"Every LaPAC card in the fixture (4 of 1,470)",paths:[],blocks:[`JPP-BidEvent#48 90 yes Two (2) Year to Provide
 Labor, Materials, & Equip…
JPP-50-00150110 88 yes TWO YEAR CONTRACT FOR TREE
 WORK FOR THE JEFFE…
50001-2842 85 yes Rebid: Arbor Services -
 Term Contract
923456-26-25-1 62 yes Autumn Wind Ln Drainage`],notes:['MAYBE never leaves this portal. The dump sends only yes for a non-federal portal. A LaPAC MAYBE is written to the archive and stops there: no board row, no cluster, no documents, no email. There were 0 MAYBEs on 28 July, so nothing was lost that night, but the door is shut every night. The shared prose elsewhere says "YES and MAYBE", which reads as a contradiction and is still an open question in the model doc.',"These 4 are the running total across all 30 archives, not one night's output. Only the last one was scored on 28 July."],tables:[]}],notes:[],then:"onto the shared board, next to every other portal"},{n:"11",title:"Publish, cluster, dedup",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["The publisher reads the fixture, not the portal folder, and upserts LaPAC's YES bids into the shared database alongside every other portal's. Bids are then grouped into clusters so the same job seen on two portals shows up once for the operator.","Clusters are split by distinct buyer before the AI re-joins them, so a blank buyer makes clustering weaker. LaPAC's buyer comes from a static department map, and on this run all 109 rows had one."],cells:[{label:"In → Out",paths:[{path:"PortalPro/src/fixtures/portal-bids.json",size:null},{path:"daily/2026-07-28/stats.json",size:"becomes the sweep_runs row"},{path:"supabase: portals · bids · clusters · sweep_runs",size:null}],blocks:[],notes:["Confirmed AI merges are stored and re-applied as forced joins on every later run, so a decision made once about two bids being the same job does not have to be made again."],tables:[]},{label:"Real board card Bid B",paths:[],blocks:[`{
 "id": "c9f82ab874d90b76",
 "portal": "louisiana-lapac",
 "portal_label": "Louisiana LaPAC",
 "source_bid_id": "JPP-BidEvent#48",
 "buyer": "Non State - Jefferson Parish
 Purchasing Department",
 "state": "LA",
 "solicitation_no": null,
 "federal": false,
 "score": 90,
 "verdict": "yes",
 "due_date": "2026-09-10",
 "source_url": "https://wwwcfprd.doa.louisiana.gov/
 osp/lapac/agency/pdf/9035500.pdf",
 "contact_name": null,
 "contact_email": null,
 "contact_phone": "504-364-2678",
 "first_seen": "2026-07-20",
 "last_seen": "2026-07-28",
 "has_documents": true
}`],notes:["first_seen 20 July, last_seen 28 July. The card is nine days old. The operator's board does not distinguish that from a card born tonight."],tables:[]}],notes:["A brand-new YES always says it has no documents. has_documents is not read from the snapshot. It is looked up in the database, and the document rows are not written until the next card down. So Autumn Wind, judged and published that same night with its PDF already attached in the snapshot, went onto the board as has_documents: false, while the three older LaPAC cards all say true. The flag catches up on the next run."],then:"the PDF becomes a stored file, then a list of requirements"},{n:"12",title:"Documents and requirements",who:"2.85b run_enrichment_phase.py → publish_bid_documents.py · 2.87 extract_doc_text.py → requirements-extractor → apply_requirements.py",summary:["The document pass looks through every portal's snapshot for bids carrying a documents list, uploads each file to the shared bucket, and files a row against the bid's cluster. LaPAC's document shape already matches what this pass expects, so its solicitation PDFs land without any portal-specific code.","Then the text is pulled out of those files and an agent reads it for what the bid demands: bonds, licences, insurance, pre-bid meetings. This phase never skips, even if enrichment was partial."],cells:[{label:"In → Out",paths:[{path:"bids/all-bids.json",size:"5 of 109 rows carry documents"},{path:"supabase.bid_documents + bucket bid-docs/<cluster>/documents/",size:null},{path:"data/portals/requirements-manifest.json + requirements-input.json",size:null},{path:"supabase.bid_requirements",size:null}],blocks:[],notes:[],tables:[]},{label:"What actually reaches this stage from LaPAC",paths:[],blocks:[],notes:["A bid that was never published has no cluster, so there is nothing to attach a file to and it is skipped. That is 107 of the 109, not 105: the other two all-time cards left the board long ago (JPP-50-00150110 last seen 13 July, 50001-2842 last seen 25 June), so subtracting 4 from tonight's 109 mixes two different piles. It is not a bug, it is the point: we only pay to store what the operator might bid."],tables:[[{header:!1,cells:["Bids in the snapshot","109"]},{header:!1,cells:["With a .pdf link","104"]},{header:!1,cells:["With the PDF actually read","5"]},{header:!1,cells:["Published as YES, so eligible here","4 cards all time, and only 2 of those 4 are bids in this snapshot"]}]]}],notes:[],then:"now that buyers and dates are filled in, look for duplicates again"},{n:"13",title:"Second look for duplicates",who:"2.875 · llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["Enrichment just filled in blanks. Pairs that could not be compared an hour ago now can be. This pass re-judges only that residue, not the whole board.","It matters here because a Jefferson Parish tree contract on LaPAC can be the same job as one seen on BidNet or DemandStar, and joining them means the operator reads one card, not three. On disk it has not happened yet: the current merge file data/portals/llm-dedup-merges.json holds 17 pairs and none of them is a LaPAC bid."],cells:[{label:"In → Out",paths:[{path:"supabase.clusters + dedup_adjudications",size:null},{path:"data/portals/llm-dedup-merges.json",size:null}],blocks:[],notes:[],tables:[]}],notes:[],then:"what changed since last time, and who needs to be told"},{n:"14",title:"Watch, mail, health check",who:"2.88 · watch_list_signals.py · publish_page_text.py · bid_watch.py · new_bids_email.py · alerts_engine.py · contracts_digest.py · pipeline_sentinel.py",summary:["Tonight's snapshot is compared against the last archived one for changes the list page already shows, mainly a close date moving. Then the digests go out and the health check runs."],cells:[{label:null,paths:[],blocks:[],notes:[],tables:[[{header:!0,cells:["Step","What it does for LaPAC"]},{header:!1,cells:["List-signal watcher",'runs, but narrowly. The registry says watch: "none", which only turns off the heavier page re-capture, and this watcher does walk every slug. It then drops any bid that has no cluster (scripts/watch_list_signals.py:128) — and only a published YES has one. So on 28 July exactly 2 of the 109 bids could ever raise a bid_updates row. A close date moving on the other 107 is read off disk and thrown away.']},{header:!1,cells:["Page-text publisher","does nothing here. The engine never sets page_text; 0 of the 109 rows have that key. LaPAC's text lives in description instead."]},{header:!1,cells:["Discovery, deadline and contract digests","silent until RESEND_API_KEY exists in data/auth/resend.env"]},{header:!1,cells:["Sentinel","checks every portal finished every phase, writes data/portals/sentinel.json"]}]]}],notes:[],then:null}],d=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","What it costs"]},{header:!1,cells:["The list page has no scope, ever. Scope lives only in the linked PDF","Pass 1 decides on a title and a department name. 104 of 109 bids carried a PDF link that night and 5 had been read. For a SKIP the PDF is never opened, so nobody ever finds out what it said."]},{header:!1,cells:["Text captured once can vanish, and nothing re-fetches it","Three of the 8 OPEN bids each held 6,000 characters on the day they were opened (5 July, 7 July, 13 July) and zero on every run after. Enrichment only visits the ids handed to it, which are that night's new OPENs, and LaPAC is left out of the zero-document backstop on purpose. Captures from 20 July onward have survived three runs, so the loss looks stopped, but the three damaged bids are still damaged."]},{header:!1,cells:['_detail_ok: false does not mean "the fetch failed"',"It is stamped on every row at pull time as a placeholder. On 28 July it read false on 104 of 109 rows simply because nobody had opened their PDFs. Reading it as a failure count would badly overstate the breakage."]},{header:!1,cells:["The report's triage row counts the whole board",`"8 OPEN / 101 SKIP" totals 109, not the 20 bids the AI actually read. Same for "2 YES / 6 NO": that is 8 standing verdicts, of which 2 were written that night. Quoting these as the night's work overstates it by five times.`]},{header:!1,cells:["MAYBE never leaves the portal folder",'The fixture dump sends only yes for a non-federal portal. A LaPAC MAYBE is archived and then invisible: no board row, no cluster, no documents, no email. The shared prose says "YES and MAYBE" and contradicts the code. Still an open question, not a settled policy.']},{header:!1,cells:["A brand-new YES lands on the board as has_documents: false","The flag is read from the database, and the document rows are written one stage later. Autumn Wind went on the board that way with its PDF already sitting in the snapshot. It corrects itself on the next run."]},{header:!1,cells:["buyer is a lookup, not a fact from the page","It comes from a static term-to-department map. An unmapped term yields an empty buyer, and blank buyers weaken clustering. This wall is real in the code and did not bite on 28 July: all 39 department terms resolved and 0 of 109 rows were blank."]},{header:!1,cells:["The all-departments view is capped","LaPAC's own srchopen.cfm?deptno=all misses whole agencies, confirmed in recon. That is why the pull fetches 39 department pages one at a time instead of one page."]},{header:!1,cells:["The runbook is a draft","data/louisiana-lapac/PORTAL.md is auto-generated and every field-map row still says TODO. It also lists open folders/platforms/louisiana-lapac/pull_bids.py as live code; nothing in the nightly run dispatches that file."]}]],paragraphs:[]},{heading:"Where the model doc and the disk disagree",tables:[[{header:!0,cells:["Claim in docs/portal-dataflow/louisiana-lapac.md","What the files say on 2026-07-28"]},{header:!1,cells:['"98 open bids in the last archive (2026-07-23)"',"109 bids. The model doc is written against the previous run."]},{header:!1,cells:['"~135/day quoted in the /portals roster"',"109 that night."]},{header:!1,cells:['"95 of 98 bids carry a .pdf detail_url but only 3 have description"',"104 of 109 carry a PDF link, 5 have text."]},{header:!1,cells:['"13 NEW on 2026-07-23"',"20 new on 2026-07-28."]},{header:!1,cells:["Every stage, in and out","Matched a real file on disk. The shape of the model is right; only its counts are one run old."]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk, and every count traces to daily/2026-07-28/stats.json, a row count, or a byte size. Long strings are cut with a trailing … and never reworded. Baseline map: docs/portal-dataflow/louisiana-lapac.md (evidence-cited to file:line)."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk, and every count traces to daily/2026-07-28/stats.json, a row count, or a byte size. Long strings are cut with a trailing … and never reworded. Baseline map: docs/portal-dataflow/louisiana-lapac.md (evidence-cited to file:line).",c="docs/portal-dataflow/pedia-louisiana-lapac.html",p={slug:e,title:t,eyebrow:a,headline:s,lede:n,funnel:o,funnel_note:r,legend:i,stages:l,sections:d,footer:h,source_page:c};export{p as default,a as eyebrow,h as footer,o as funnel,r as funnel_note,s as headline,n as lede,i as legend,d as sections,e as slug,c as source_page,l as stages,t as title};
