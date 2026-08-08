const e="nc-wilmington",t="City of Wilmington NC: what happens to a bid, stage by stage",s="Portal pedia · 32",n="City of Wilmington NC: the night a dead feed woke up",a="Every stage of this portal's run, with a real record from the actual files at each step. All data is from the run of 28 July 2026, the first run in the portal's 28 archive days that found anything at all. Two bids are followed the whole way: one thrown out at triage, one that gets scored a MAYBE at 48 and then never reaches the board.",o=[{value:"4",label:"in snapshot"},{value:"0",label:"carryover"},{value:"4",label:"new to triage"},{value:"1",label:"triage says open"},{value:"3",label:"triage says skip"},{value:"0",label:"yes"},{value:"1",label:"maybe"},{value:"0",label:"no"}],i="Every count above is copied from data/nc-wilmington/daily/2026-07-28/stats.json (499 bytes), written at 21:33:22 UTC. The 19-listings figure comes from that night's own pull log at 21:27:06 UTC: parsed 19 listed bids (ALL PAGES) · 15 closed/past dropped · 4 OPEN.",r=["Bid A · CSBR-AB-SE-0826 · Castle Street boat ramp repairs. Dies at triage.","Bid B · DRA-MG-0826 · Pirate's Cove drainage improvements. Ends as MAYBE, score 48."],l=[{n:"0",title:"Is this portal due today?",who:"scripts/portal_due.py --batch portals",summary:["The gate looks at the newest dated folder under data/nc-wilmington/daily/. Older than 7 days, the portal runs. The registry sets that 7; the portal's own runbook says 30. The registry wins and the runbook is a stale auto-generated draft.","The gate counts dates, not bids. That is exactly how this portal stayed green while producing nothing: it wrote a perfectly-formed all-zero archive on schedule for seven weeks."],cells:[{label:"In",paths:[{path:"data/portals/registry.json",size:"the nc-wilmington entry"},{path:"data/nc-wilmington/daily/*/",size:"28 dated folders"}],blocks:[],notes:[],tables:[]},{label:"The registry entry, as the inspector read it",paths:[],blocks:[`{
 "slug": "nc-wilmington",
 "label": "City of Wilmington NC — Current Bids",
 "engine": "opencities",
 "batch": "portals",
 "cadence_days": 7,
 "authed": false,
 "enrich_passes": [],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:[],tables:[]}],notes:[],then:"a headless browser opens the city's Current Bids page"},{n:"1",title:"Pull the Current Bids cards",who:"data/nc-wilmington/scripts/run_daily.py → open folders/_lib/engines/opencities.py · hand-run that night",summary:["The city runs on the Granicus OpenCities system. Plain web requests get a 403 from Akamai's bot blocker, so we open the page in a headless browser and read every card.","The board is paged, 10 cards a page, sorted oldest closing date first, so the still-open ones sit at the end. The engine read page one and stopped, so it only ever saw the 10 oldest cards, all of them long closed. Whatever is read, only rows whose closing date is today or later are kept: 19 parsed, 15 dropped, 4 kept.",`On this night the engine had not been fixed yet, and a human did the walk. The engine's own pull at 21:22:55 UTC did what it had done every time before: parsed 10 listed bids · 10 closed/past dropped · 0 OPEN. Four minutes later the log reads MANUAL all-pages pull (engine pager bug workaround), and that hand-run is where the night's 19 rows and 4 open bids come from. The code fix — walk every page and check the row count against the "19 Result(s) Found" the board prints — landed the next morning, 29 July at 09:38 UTC. The bids, the counts and every record below are the anchor night's real output; what was done by hand is the page-walk here and the detail fetch at stage 4.`],cells:[{label:"In → Out",paths:[{path:"data/nc-wilmington/config.json",size:"entity_url, state NC, out_of_core true"},{path:"data/nc-wilmington/bids/all-bids.json",size:"12,522 bytes · 4 rows"},{path:"data/nc-wilmington/bids/index.json",size:"460 bytes"}],blocks:[`{
 "generated_at": "2026-07-29T09:38:18.684786+00:00",
 "snapshot_total": 4,
 "parsed_total": 19,
 "closed_dropped": 15,
 "open_total": 4,
 "pages_walked": 2,
 "pages_reported": 2,
 "results_reported": 19,
 "pager_info": "Page 1 of 2",
 "empty_evidence": ""
}`],notes:[],tables:[]},{label:"Real record Bid A",paths:[],blocks:[`{
 "bid_id": "CSBR-AB-SE-0826",
 "title": "CASTLE STREET BOAT RAMP REPAIRS &
 RIVERWALK SUPPORT A",
 "buyer": "City of Wilmington",
 "state": "NC",
 "due_date": "2026-08-11",
 "due_date_raw": "Closing date August 11, 2026,
 03:00 PM",
 "status": "Open",
 "reference_number": "CSBR-AB-SE-0826",
 "detail_url": "https://www.wilmingtonnc.gov/…/
 CASTLE-STREET-BOAT-RAMP-REPAIRS-RIVERWALK-
 SUPPORT-AT-ANNE-BONNYS",
 "description": "ADVERTISEMENT",
 "_detail_ok": true,
 "_geo_flag": "out_of_core_state"
}`],notes:[`The title really is cut off at "SUPPORT A". That is what the card says. _geo_flag is stamped on every row because North Carolina sits outside LGS's core states.`],tables:[]}],notes:[`A zero now has to be proven. If the page gives no rows and no evidence it is genuinely empty (no "0 Result", no "no current bids" message), the pull raises instead of writing an empty snapshot. A clean-looking zero that was really a broken page is what hid this portal's blindness for seven weeks. Read the date on that block. Both files in bids/ were rewritten by a later pull on 29 July at 09:38 UTC, one day after the archive was compiled, so the exact wording "Page 1 of 2" and results_reported: 19 belongs to that later run. The 19 parsed, 15 dropped and 4 kept are the same on both nights: the 28th's own log line at 21:27:06 says parsed 19 listed bids (ALL PAGES) · 15 closed/past dropped · 4 OPEN. Same 4 bids, slightly different page text, 12,522 bytes here against 12,314 bytes in the frozen archive copy.`],then:"today's 4 are compared against yesterday's memory"},{n:"2",title:"Work out what is actually new",who:"platform_sweep.prep · run_daily.py step 2",summary:["Today's 4 bids are matched against the newest earlier archive. Anything already decided is carried forward for free; anything unknown goes to the AI.",'All 4 came out "new", but not because the city posted them that day. The newest earlier archive held zero bid ids to compare against, because every earlier archive was empty. These bids had been sitting on page two of the board for weeks. The fix did not find new work; it revealed work we had been missing.'],cells:[{label:"Out: four files",paths:[{path:"runs/triage-input.json",size:"801 bytes · 4 rows"},{path:"runs/triage-carryover.json",size:"2 bytes · 0 rows"},{path:"runs/judge-input.json",size:"2,620 bytes · 4 rows"},{path:"runs/_funnel.json",size:"149 bytes"}],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 4,
 "carryover_count": 0,
 "triage_input_count": 4,
 "prior_archive_ids_compared_against": 0
}`],notes:[],tables:[]},{label:"Real record Bid A · triage-input.json",paths:[],blocks:[`{
 "idx": 1,
 "bid_id": "CSBR-AB-SE-0826",
 "title": "CASTLE STREET BOAT RAMP REPAIRS &
 RIVERWALK SUPPORT A",
 "buyer": "City of Wilmington",
 "state": "NC",
 "due_date": "2026-08-11"
}`,`{
 "idx": 1,
 "bid_id": "CSBR-AB-SE-0826",
 "description_full": "Title: CASTLE STREET BOAT RAMP
 REPAIRS & RIVERWALK SUPPORT A
 Buyer: City of Wilmington
 State: NC
 Closes: 2026-08-11
 Source URL: https://www.wilmingtonnc.gov/…

 RFP body (truncated to 6KB):
 "
}`],notes:["Six fields. Triage gets a title and a date, nothing more.","The RFP body header is there and nothing follows it. This file is built before the detail pages are fetched, so it is always bodyless here. It is not the file the judge reads. Stage 5 builds that one."],tables:[]}],notes:[],then:"the first triage this portal has ever run"},{n:"3",title:"Pass 1: keep or drop, on the title alone",who:"max-triage · AI",summary:["Each new bid gets one word: OPEN or SKIP. The default is SKIP. A bid only opens on a plain LGS work word (tree, debris, vegetation, clearing, mowing, brush, stump, storm, creek, channel, ditch) or on a cryptic utility-buyer or on-call city title.","Three of the four are city construction jobs with no such word. One says drainage. This is the first time Pass 1 has ever produced a decision for this portal."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"4 rows"},{path:"runs/triage-verdicts.json",size:"542 bytes · 4 rows"}],blocks:[`DRA-MG-0826 OPEN drainage = portal OPEN verb
CSBR-AB-SE-0826 SKIP boat ramp/riverwalk construction,
 no LGS verb
ALLE-IH-0926 SKIP streetscape construction, no LGS verb
RFQ No. S6-0926 SKIP park project, no LGS verb`],notes:["Look at the fourth id. RFQ No. S6-0926, with spaces and a full stop. The id is whatever the card printed as its reference number, so it can be free text."],tables:[]},{label:"Real records Bid A · droppedBid B · opened",paths:[],blocks:[`{
 "idx": 1,
 "bid_id": "CSBR-AB-SE-0826",
 "decision": "SKIP",
 "reason": "boat ramp/riverwalk construction,
 no LGS verb"
}`,`{
 "idx": 0,
 "bid_id": "DRA-MG-0826",
 "decision": "OPEN",
 "reason": "drainage = portal OPEN verb"
}`],notes:["Bid A's journey ends here. Three cards read, one line written. That is its whole cost."],tables:[]}],notes:[],then:"now go and open the detail pages"},{n:"4",title:"Fetch the detail pages: the step that used to do nothing",who:"platform_sweep.enrich_opens → opencities.enrich_details · hand-run that night",summary:["Each bid's own page holds the contact person and the file links. Opening one directly fails: Akamai bounces it in a redirect loop because the browser has not visited the list first. So this step loads the list page, waits for the cookie, then walks to each detail page from that same warmed browser tab. It works.","In the engine, this step was written to return zero and do nothing at all, on the belief that the redirect loop could not be beaten. That is why every earlier record on this portal has an empty description and no contact. On this night the warmed-context walk was run by hand, the same way the page-walk was, which is why the log line reads warm-context enrich_details rather than the engine's own wording. It went into the engine the next morning at 09:40 UTC, where it logs enrich_details: 4 OPEN bids via warmed-context detail pages and returns the identical 4 of 4 and 7 document refs."],cells:[{label:"What the run log actually recorded",paths:[],blocks:[`21:30:17 detail OK DRA-MG-0826: contact=True docs=4
21:30:20 detail OK CSBR-AB-SE-0826: contact=True docs=1
21:30:23 detail OK ALLE-IH-0926: contact=True docs=1
21:30:25 detail OK RFQ No. S6-0926: contact=True docs=1
21:30:27 warm-context enrich_details:
 4/4 enriched, 7 document refs`],notes:[`What it can and cannot get. Contact name, phone, email and every file link: yes. A real scope description: no. The page's "Summary" block on this system is just a list of document titles, so the engine writes what is there and stamps _thin_description: true so the judge knows not to trust it.`,"Read from data/nc-wilmington/logs/pull_log.txt. This step fetches whatever list of bids it is handed, and on this run it was handed all four, not just the one the triage opened. That is why the three skipped bids on disk also carry contacts and files."],tables:[]},{label:"Real record Bid B · what came back",paths:[],blocks:[`{
 "bid_id": "DRA-MG-0826",
 "title": "PIRATE'S COVE DRAINAGE IMPROVEMENTS",
 "status": "Pending",
 "due_date": "2026-08-06",
 "description": "ADDENDUM #1 IMPROVEMENTS ADDENDUM #1
 PRE-BID CONFERENCE AGENDA SIGN-IN SHEET
 ADVERTISEMENT",
 "contact_name": "ZACH ROMAN",
 "contact_email": "zach.roman@wilmingtonnc.gov",
 "contact_phone": "910-765-0450",
 "documents": [
 {"file_name": "PRE-BID-SIGN-IN-SHEET.xlsx
 (XLSX, 46KB)", …},
 {"file_name": "DRA-MG-0826-PIRATES-COVE-DRAINAGE-
 IMPROVEMENTS.pdf(PDF, 32MB)", …},
 {"file_name": "Addendum-No.-1-DRA-MG-0826-PIRATES-
 COVE-DRAINAGE-IMPROVEMENTS.pdf(PDF, 167KB)", …},
 {"file_name": "Addendum-No.-1-DRA-MG-0826-PIRATES-
 COVE-DRAINAGE.pdf(PDF, 10MB)", …}
 ],
 "_thin_description": true,
 "_detail_ok": true,
 "page_text": "Skip to main content\\nBuilding One City
 …Closing date August 06, 2026, 03:00 PM
 Reference numberDRA-MG-0826\\nStatusPending
 SummaryADDENDUM #1 IMPROVEMENTS…"
}`],notes:['Status says "Pending" and the bid was kept anyway. On this board the status word is unreliable, so the engine decides on the closing date alone: 6 August is in the future, so it stays.'],tables:[]}],notes:[],then:"the one OPEN is packaged for scoring"},{n:"5",title:"Build the judging set",who:"platform_sweep.build_judge_input_open",summary:["This picks up this run's OPENs plus any older OPEN still sitting without a score, and rebuilds each one from the snapshot, which by now has the enriched text in it.","The model doc says this file has never existed for this portal. It exists now: 711 bytes, one row."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json + runs/triage-carryover.json",size:"the OPEN ids"},{path:"data/nc-wilmington/bids/all-bids.json",size:"now enriched"},{path:"runs/judge-input-open.json",size:"711 bytes · 1 row"}],blocks:[],notes:["Two files, one name apart, and only one of them counts. judge-input.json (stage 2) has an empty RFP body because it was written before the detail fetch. judge-input-open.json (here) has the real one. The judge reads the second. Anyone reading the first would conclude the portal captures nothing."],tables:[]},{label:"Real record Bid B · what the judge will see",paths:[],blocks:[`{
 "idx": 0,
 "bid_id": "DRA-MG-0826",
 "title": "PIRATE'S COVE DRAINAGE IMPROVEMENTS",
 "buyer": "City of Wilmington",
 "state": "NC",
 "due_date": "2026-08-06",
 "detail_url": "https://www.wilmingtonnc.gov/…/
 PIRATES-COVE-DRAINAGE-IMPROVEMENTS",
 "description_full": "Title: PIRATE'S COVE DRAINAGE
 IMPROVEMENTS
 Buyer: City of Wilmington
 State: NC
 Closes: 2026-08-06
 Source URL: https://www.wilmingtonnc.gov/…

 RFP body:
 ADDENDUM #1 IMPROVEMENTS ADDENDUM #1 PRE-BID
 CONFERENCE AGENDA SIGN-IN SHEET ADVERTISEMENT"
}`],notes:["That is the whole body: four document titles. The real scope is inside a 32 MB plan set that nothing on this path opens."],tables:[]}],notes:[],then:"the AI scores it out of 100"},{n:"6",title:"Pass 2: yes, maybe or no",who:"max-bid-judge · AI",summary:["One bid scored. The answer is maybe, 48. No YES, no NO. Any yes or maybe from this portal has to carry the out-of-core flag, because North Carolina is outside LGS's home footprint, and it does.","The reasoning is worth reading in full. The judge is explicit that it cannot tell ditch clearing from storm-sewer pipework, and says so instead of guessing."],cells:[{label:"In → Out",paths:[{path:"runs/judge-input-open.json",size:"1 row"},{path:"runs/judge-verdicts.json",size:"1,201 bytes · 1 row"}],blocks:[],notes:['An honest 48. The score band 40-59 means "surface it, do not spend on it yet". The judge asks for the plan set to be pulled and an operator to read the bid schedule. Everything it needed to decide properly was in a PDF that no stage on this path reads.'],tables:[]},{label:"Real record Bid B · MAYBE, 48",paths:[],blocks:[`{
 "idx": 0,
 "bid_id": "DRA-MG-0826",
 "would_lgs_bid": "maybe",
 "lgs_score": 48,
 "reasoning": "The strong-title/thin-description rule
 does not rescue this one: it fires only when the
 title is a verbatim Category 1-5 verb, and
 \\"Drainage Improvements\\" carries no LGS verb - no
 debris, tree, ROW, clearing, or vegetation. The
 page body is document titles only (addendum,
 pre-bid agenda, advertisement), so I cannot tell
 channel/ditch clearing and earthwork (real
 Category 6 adjacent work) from storm-sewer pipe
 and structures construction, which is a flat
 non-fit; the 32MB plan set leans toward
 engineered civil. LGS's own book backs the
 caution: drainage/creek/channel is 4 bids out of
 819, all four in Mississippi on local-engineer
 relationships, one won, with no such work outside
 the home state. Real overlap plus unknown work
 shape is exactly the 40-59 band - surface it,
 pull the plan set, and let the operator read the
 bid schedule before we spend anything on it.",
 "red_flags": [
 "out_of_core_state",
 "thin_description_pull_rfp_packet",
 "hybrid_includes_drainage_civil_construction",
 "low_scale_inferred_single_site"
 ]
}`],notes:[],tables:[]}],notes:[],then:"the day is frozen into a folder"},{n:"7",title:"Write the day's folder",who:"platform_sweep.compile_archive",summary:["Carryover and new decisions are merged, old verdicts merged with this run's, and the dated folder is written. That folder is tomorrow's memory: the diff at stage 2 reads it.","This is also where this portal does its own carry-forward. It does not need the shared cross-portal safety net, because compile already re-merges yesterday's verdicts for bids still in the snapshot."],cells:[{label:"The archive · data/nc-wilmington/daily/2026-07-28/",paths:[],blocks:[],notes:["The row in daily/INDEX.md for this day: | 2026-07-28 | 4 | 4 | 1 | 0 | 1 | 0 |, the first line in that table that is not all zeros. The 27 rows under it, from 2026-06-10 to 2026-07-20, are every one of them zeros."],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","4 rows, the full enriched bids","12,314 bytes"]},{header:!1,cells:["triage.json","4 decisions, tomorrow's memory","542 bytes"]},{header:!1,cells:["verdicts.json","1 row, the MAYBE","2,176 bytes"]},{header:!1,cells:["stats.json","the funnel counts","499 bytes"]},{header:!1,cells:["report.md","human summary","920 bytes"]}]]},{label:"verdicts.json: one bid, two spellings of every field",paths:[],blocks:[`{
 "bid_id": "DRA-MG-0826",
 "would_lgs_bid": "maybe",
 "lgs_score": 48,
 "reasoning": "The strong-title/thin-description rule
 does not rescue this one…",
 "red_flags": ["out_of_core_state", …],
 "bid_key": "nc-wilmington:DRA-MG-0826",
 "score": 48,
 "verdict": "maybe",
 "primary_reason": "The strong-title/thin-description
 rule does not rescue this one…"
}`],notes:["would_lgs_bid and verdict hold the same word; lgs_score and score the same number; reasoning and primary_reason the same paragraph. The archive writer normalises into both spellings so downstream readers cannot miss it either way. It costs bytes: this 2,176-byte file stores one bid."],tables:[]}],notes:[],then:"the portal's own work is done, the shared machinery takes over"},{n:"8",title:"Carry forward: this portal is not in it, on purpose",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:["The shared safety net rescues verdicts for bids that dropped out of one night's pull. The --all run only touches portals whose registry setting says orchestrator. This one says engine-internal, so the script walks past it.","In plain terms: this portal already did the job itself at stage 7, so running the shared version too would apply carry-forward twice. Skipping is the correct behaviour, not a gap."],cells:[{label:"The one way it can still go wrong",paths:[],blocks:[],notes:["Running the script by hand with --portal nc-wilmington bypasses the registry filter and would double-apply. There is evidence of exactly one hand-run in the past: data/nc-wilmington/daily/2026-06-23/_carryforward_audit.json."],tables:[]}],notes:[],then:"the maybe goes into the ledger, and stops there"},{n:"9",title:"Ledger, report, board fixtures: where the maybe gets lost",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py + dump_activity_matrix.py",summary:["Three shared steps read the day folder. The first two show the bid. The third does not, and that is the finding of this whole page.","The cumulative ledger keeps yes and maybe, so Pirate's Cove lands in it. The daily report is rewritten into the shared layout and prints the bid under MAYBE. But the PortalPro board dump keeps yes only for any portal that is not federal, so this bid produces zero board rows."],cells:[{label:"Real record Bid B in data/portals/cumulative-yes.json",paths:[],blocks:[`{
 "portal": "nc-wilmington",
 "bid_id": "DRA-MG-0826",
 "title": "PIRATE'S COVE DRAINAGE IMPROVEMENTS",
 "buyer": "City of Wilmington",
 "state": "NC",
 "score": 48,
 "verdict": "maybe",
 "category": "",
 "flags": [
 "out_of_core_state",
 "thin_description_pull_rfp_packet",
 "hybrid_includes_drainage_civil_construction",
 "low_scale_inferred_single_site"
 ],
 "close_date": "2026-08-06",
 "first_seen": "2026-07-28",
 "last_seen": "2026-07-28",
 "runs_seen": 1
}`,`## YES — Max would bid

_none_

## MAYBE — operator judgment

- **[48] PIRATE'S COVE DRAINAGE IMPROVEMENTS** —
 City of Wilmington · closes 2026-08-06`],notes:[],tables:[]},{label:"The board fixture: what nc-wilmington contributes",paths:[],blocks:[`bids with portal == "nc-wilmington": []
portals list: "nc-wilmington"
portal_labels: "City of Wilmington NC — Current Bids"
last_run_dates["nc-wilmington"]: "2026-07-28"`,`"2026-07-28": {
 "new": 4,
 "open": 1,
 "yes": 0,
 "maybe": 0
}`],notes:[`Follow the chain. The Matrix takes New and Open from stats.json, but takes Yes and Maybe from the board fixture, not from stats.json. The fixture dropped the maybe. So stats.json says "maybe": 1 and the Matrix cell says "maybe": 0 for the same day. This is not a stale file. The Matrix was rebuilt at 22:38:25 UTC that same night, after the archive was written at 21:33, so its own New 4 and Open 1 could only have come from this run's stats.json. It read the fresh numbers and still wrote zero. Nothing crashes; the two figures simply come from different places, and one of those places filters.`,"Read out of PortalPro/src/fixtures/portal-bids.json. The portal's name is on the board. Its one scored bid is not."],tables:[]}],notes:[],then:"bids stop being portal-shaped here, if there are any"},{n:"10",title:"Publish, cluster, dedup: nothing to cluster",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["This is where a portal's bids meet every other portal's, and the same job posted on two portals becomes one card. The input is the board fixture from stage 9, which holds zero nc-wilmington bids.","So this portal writes a portals row and a sweep_runs row (its name and its counts) and no bids row. With no bid row there is no cluster, and with no cluster the next three stages have nothing to work on."],cells:[{label:null,paths:[],blocks:[],notes:["This is the practical cost of the maybe filter. A bid that never reaches bids is invisible to the board, to dedup, to requirements, to the digests and to the bid packs. The only places Pirate's Cove exists are its day folder, the cumulative ledger, and the monitor board's HTML.","That table is the mechanism, traced from the fixture file on disk and the publish script, not from a live read of the database. What is directly checkable is the input: the fixture holds zero nc-wilmington bids, and this stage publishes from the fixture."],tables:[[{header:!0,cells:["Table","What a portal with no published bids contributes"]},{header:!1,cells:["portals","one row: key and label"]},{header:!1,cells:["sweep_runs","one row: run date plus the yes / maybe / open / raw / no counts"]},{header:!1,cells:["bids","nothing: the fixture had no rows to publish"]},{header:!1,cells:["clusters","nothing: clustering works on published bids"]}]]}],notes:[],then:"the stage that would have read the 32 MB plan set"},{n:"11",title:"Documents and requirements: the files sit unread",who:"2.87 extract_doc_text.py + build_bidpack.py + requirements-extractor · 2.875 dedup re-pass",summary:["This stage downloads a cluster's documents, pulls the text out, and has an AI write down what the bid actually requires, with quotes. It works on clusters. There is no cluster here.","That is the sharpest gap on this page. The engine captured 7 real document links that night, including the 32 MB plan set the judge said it needed. Those links are sitting in daily/2026-07-28/new-bids.json. Nothing downstream ever opens them, because the bid never became a cluster. The judge asked for the plan set and the pipeline had already fetched the link to it.","The second dedup pass at 2.875 sits in the same position. It re-compares bids after enrichment has filled in buyers and closing dates, to catch matches the first pass could not see. With no published bid and no cluster, it has nothing here to re-compare."],cells:[{label:"The 7 document links captured, and where they stop",paths:[],blocks:[],notes:['And there is no named excuse for it either. The shared gap-reason list has no entry for this portal, so if a bid from here ever did surface missing its documents, the board would show the generic "not yet diagnosed" line rather than a real reason. That is absence of code, checked by searching scripts/gap_reasons.py.'],tables:[[{header:!0,cells:["Bid","Files captured","Read by anything?"]},{header:!1,cells:["DRA-MG-0826","4: plan set 32 MB, two addenda, pre-bid sign-in sheet","no"]},{header:!1,cells:["CSBR-AB-SE-0826","1: the bid PDF, 2 MB","no"]},{header:!1,cells:["ALLE-IH-0926","1","no"]},{header:!1,cells:["RFQ No. S6-0926","1","no"]}]]}],notes:[],then:"what changed since last time?"},{n:"12",title:"Watch, digests, sentinel",who:"2.88 · watch_list_signals.py · new_bids_email.py · bid_watch.py · pipeline_sentinel.py",summary:["Watch mode for this portal is none, so nothing re-visits the source to spot an addendum. The digests read the shared database, which has no bid row from here, so no email mentions this portal. The sentinel is the one place a permanently-zero portal should have shown up as a health row. The portal's own runbook records its sentinel health as unknown as of 14 July."],cells:[{label:null,paths:[],blocks:[],notes:['The bigger point about this stage. Bid B is an addendum-stage bid: its own page already says "ADDENDUM #1". A portal with watch off cannot notice a second addendum, a moved date, or a cancellation. For a bid closing on 6 August that matters.'],tables:[[{header:!1,cells:["Re-capture the source page and diff it","off: registry watch is none"]},{header:!1,cells:["Daily new-bids digest","nothing to send: no published bid rows"]},{header:!1,cells:["Bid-change watch mail","same"]},{header:!1,cells:["Sentinel health row","recorded as unknown; never flagged the seven blind weeks"]},{header:!1,cells:["Monitor board metrics","the metrics.json on disk was generated 2026-07-24, before this run, so it still shows this portal as all zeros"]}]]}],notes:[],then:null}],d=[{heading:"The quirks that bite: all on one card",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["The board is paged and sorted oldest-first; the engine read page 1 only",'seven weeks of perfect-looking empty archives, 2026-06-10 to 2026-07-20. Worked around by hand on 28 July; fixed in code on 29 July, where it now walks every page and checks its count against the "19 Result(s) Found" the page prints, so the next pager break is loud']},{header:!1,cells:["Detail fetching was a hardcoded no-op","every earlier record has no contact, no files and an empty description. Walking to detail pages from the same warmed browser tab beats it: 4 of 4 and 7 document links, hand-run on 28 July and in the engine from 29 July"]},{header:!1,cells:["The written model at docs/portal-dataflow/nc-wilmington.md is stale","it still describes a dead feed with no triage, no judging and no judge-input-open.json. All three exist on disk for 28 July"]},{header:!1,cells:["MAYBE is dropped for non-federal portals at the board dump","this portal's first and only scored bid in 28 archive days never reaches the board, Supabase, dedup, requirements, the digests or the bid packs. It lives in the day folder and the cumulative ledger only"]},{header:!1,cells:["The Matrix takes Yes/Maybe from the board fixture, not from stats.json",'stats.json says "maybe": 1; the Matrix cell for the same day says "maybe": 0']},{header:!1,cells:["Two judge input files, one letter apart","judge-input.json is built before enrichment and always has an empty RFP body; judge-input-open.json is the real one. Quoting the first would misreport the portal"]},{header:!1,cells:['The "Summary" block on this system is a list of document titles, not scope',"every description is thin and flagged _thin_description; the real scope is inside the PDFs, and no stage on this path opens them"]},{header:!1,cells:["The card's status word is unreliable",'Bid B says "Pending" and was rightly kept. The engine decides on the closing date alone; a date it cannot parse is kept too, so a parse failure never loses a bid']},{header:!1,cells:["bid_id is the card's reference number, free text","one of the four ids is literally RFQ No. S6-0926, spaces and a full stop inside a key that drives day-over-day matching"]},{header:!1,cells:['Buyer is hardcoded to "City of Wilmington" whenever the state is NC',"the engine is advertised as reusable for other OpenCities cities; a second NC city would get the wrong buyer and a non-NC city would get an empty one"]},{header:!1,cells:["The detail fetch was handed all 4 bids on this run, not just the 1 OPEN","the step fetches whatever ids the caller passes it, so this is a property of how the run was driven, not of the code. It is why the three skipped bids also carry contacts and files"]},{header:!1,cells:["The cadence gate reads folder dates, not bid counts","a portal that writes a flawless all-zero archive every 7 days looks healthy forever. Nothing in the pipeline noticed the seven blind weeks; a human reading the archive did"]},{header:!1,cells:["No entry for this portal in scripts/gap_reasons.py",'a surfaced bid missing documents would show the generic "not yet diagnosed" line instead of a named wall']},{header:!1,cells:["The runbook at data/nc-wilmington/PORTAL.md is an auto-generated draft","it says cadence 30 days where the registry says 7, and its whole field map is still TODO"]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to daily/2026-07-28/stats.json, a row count, or a file size. Baseline map: docs/portal-dataflow/nc-wilmington.md, which this page contradicts on purpose, because that doc was written before the 2026-07-29 pager and enrichment fixes and the files on disk now disagree with it."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to daily/2026-07-28/stats.json, a row count, or a file size. Baseline map: docs/portal-dataflow/nc-wilmington.md, which this page contradicts on purpose, because that doc was written before the 2026-07-29 pager and enrichment fixes and the files on disk now disagree with it.",c="docs/portal-dataflow/pedia-nc-wilmington.html",p={slug:e,title:t,eyebrow:s,headline:n,lede:a,funnel:o,funnel_note:i,legend:r,stages:l,sections:d,footer:h,source_page:c};export{p as default,s as eyebrow,h as footer,o as funnel,i as funnel_note,n as headline,a as lede,r as legend,d as sections,e as slug,c as source_page,l as stages,t as title};
