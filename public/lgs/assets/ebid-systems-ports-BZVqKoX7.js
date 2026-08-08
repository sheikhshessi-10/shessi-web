const e="ebid-systems-ports",t="eBid / ProcureWare: what happens to a bid, stage by stage",s="Portal pedia · 16",a="eBid / ProcureWare: seven boards, one browser, and a night that decided almost nothing",n="Every stage of the run of 28 July 2026, with a real record from the actual file at each step. The headline of that night is what did not happen: five bids were new, all five were thrown out at triage, and the AI judge was never called at all. The two YES bids in the day's folder are older decisions riding along: one was scored on 20 July, the other on 23 July, and both reach 28 July through the 23 July folder.",o=[{value:"30",label:"open bids pulled"},{value:"25",label:"seen before"},{value:"5",label:"new tonight"},{value:"5",label:"new bids skipped"},{value:"0",label:"judged tonight"},{value:"2",label:"yes on file, carried"}],r="Sources: data/ebid-systems-ports/daily/2026-07-28/stats.json (424 bytes) and data/ebid-systems-ports/runs/_funnel.json (152 bytes). The stats file reports triage.open: 2 and scoring.yes: 2, but both OPENs and both YES verdicts are older decisions being carried along, not work done on 28 July: runs/judge-input-open.json and runs/judge-verdicts.json are both 2 bytes, which is an empty list.",i=["Bid A · 085-26 · Steel Substation Structures, Lincoln Electric Systems. SKIP.","Bid B · 087-26 · 2026 Vegetation Removal, Lincoln Electric Systems. YES, score 80.","Bid A was skipped back on 9 July, Bid B scored on 20 July. On 28 July they arrive as carryover and no one re-reads them."],l=[{n:"1",title:"Is it this portal's turn?",who:"python scripts/portal_due.py --batch portals",summary:["This board is not swept every night. The gate looks at the newest dated folder under data/ebid-systems-ports/daily/ and compares it to the portal's cadence. Three days or older means due.","On 28 July the newest folder was 2026-07-23, five days old, so the portal was printed as due. Live cadence comes from the portals table in the cloud database; the 3 in registry.json is only the offline fallback."],cells:[{label:"In → Out",paths:[{path:"data/portals/registry.json",size:"the portal's row"},{path:"data/ebid-systems-ports/daily/",size:"33 dated folders on record"},{path:"stdout",size:"one slug per line"}],blocks:[],notes:["Three days is the shortest cadence anything in Batch D gets: the two Alabama sweeps are three as well, bonfire-ports is seven. Of the three ports-and-airports platforms this is the only one whose engine starts a real browser."],tables:[]},{label:"The real registry row",paths:[],blocks:[`{
 "slug": "ebid-systems-ports",
 "label": "eBid / ProcureWare",
 "engine": "ebid_systems",
 "batch": "portals",
 "cadence_days": 3,
 "authed": false,
 "enrich_passes": [],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:["Every one of these fields decides something later on this page. carry_forward matters most: see stage 11."],tables:[]}],notes:[],then:"one child agent picks up the whole sweep"},{n:"2",title:"Hand the whole sweep to one worker",who:"Agent(general-purpose) → .claude/skills/ebid-systems-ports-sweep/SKILL.md",summary:["The portal sits in Batch D, a batch of four: alabama-aldot-letting, alabama-purchasing, bonfire-ports and this one. One child agent reads the sweep instructions and runs every stage from the pull to the day folder.","This is the slowest pull in its batch: one browser page load per board, then a fresh browser window for every single open bid, each with a half-second pause. It is not on the heavy-pull list, so a parent could still push it to the background and stall it."],cells:[{label:"In → Out",paths:[{path:".claude/skills/ebid-systems-ports-sweep/SKILL.md",size:"the instructions"},{path:"child agent process",size:"runs pull through compile"}],blocks:[],notes:[],tables:[]},{label:"What the run actually cost, from logs/pull_log.txt",paths:[],blocks:[`20:38:33 pull starting · 7 tenant(s) · today=2026-07-28
20:45:10 wrote 30 open bids across 7/7 resolved boards

six minutes thirty-seven seconds of browser time
2,671 rows dropped as closed, cancelled or past due
30 rows kept
2,701 rows accounted for across the seven boards`],notes:[],tables:[]}],notes:[],then:"turn the config list into board addresses"},{n:"3",title:"Which boards do we visit?",who:"open folders/_lib/engines/ebid_systems.py · board resolution, before any browser starts",summary:["eBid Systems is a brand name. The software is ProcureWare, and every agency gets its own address like les.procureware.com. Each line in the config becomes https://<tenant>.procureware.com/Bids. If a line points at an agency's own .gov page instead, the engine fetches that page and follows the first ProcureWare link it finds.","On this run that second path was never needed. All boards resolved straight through, so this stage did nothing but pass the list along."],cells:[{label:"In → Out",paths:[{path:"data/ebid-systems-ports/config.json",size:"7 tenants at run time"},{path:"data/ebid-systems-ports/bids/index.json",size:"635 bytes"}],blocks:[],notes:["The config file on disk today does not match the run. Three checkable facts: the committed version of config.json lists 7 tenants; the working copy on disk right now lists 3 (ctairports, norta, mcallen); the 28 July run used 7, proved by tenants_configured: 7 in index.json and by the first line of the pull log. The four missing from the working copy (les, nppd, pocca, cityofbonitasprings) supplied 17 of that night's 30 open bids, and Bid B lives on les. A run with the file as it stands would visit three boards and never see it."],tables:[]},{label:"The real bids/index.json from that run",paths:[],blocks:[`{
 "generated_at": "2026-07-28T20:45:10.325133+00:00",
 "snapshot_total": 30,
 "source": "ebid-systems-ports",
 "engine": "ebid_systems",
 "endpoint": "https://<tenant>.procureware.com/Bids",
 "tenants_configured": 7,
 "boards_resolved": 7,
 "tenants_with_bids": 7,
 "tenants_no_board": [],
 "tenants_skipped": [],
 "per_tenant_open": {
 "ctairports.procureware.com": 1,
 "norta.procureware.com": 8,
 "mcallen.procureware.com": 4,
 "les.procureware.com": 5,
 "nppd.procureware.com": 6,
 "pocca.procureware.com": 5,
 "cityofbonitasprings.procureware.com": 1
 },
 "open_total": 30
}`],notes:[],tables:[]}],notes:[],then:"a real browser opens each board"},{n:"4",title:"Pull: render the grid, then open every open bid",who:"data/ebid-systems-ports/scripts/run_daily.py → open folders/_lib/engines/ebid_systems.py",summary:["The bid list is drawn by JavaScript in the visitor's browser, so plain page fetching gets nothing. A headless Chromium opens each board, forces the table to show every row instead of the default 50, and reads the columns by their header names, so a board that reorders its columns does not break the parse.","Anything closed, cancelled, awarded or past its due date is dropped. Then each survivor gets its own fresh browser window on its detail page, for the description and the buyer contact. That is why 30 open bids cost 30 extra page loads."],cells:[{label:"In → Out",paths:[{path:"https://<tenant>.procureware.com/Bids",size:"7 boards, rendered"},{path:"https://<tenant>.procureware.com/Bids/<GUID>",size:"one per open bid"},{path:"data/ebid-systems-ports/bids/all-bids.json",size:"42,224 bytes · 30 rows"},{path:"data/ebid-systems-ports/logs/pull_log.txt",size:"appended"}],blocks:[`description filled 24 of 30 (les 5 of 5 blank)
contact filled 22 of 30 (pocca 5 of 5 blank)
detail page opened 29 of 30
documents_gated 30 of 30`],notes:[],tables:[]},{label:"Real record Bid B, as pulled",paths:[],blocks:[`{
 "bid_id": "087-26",
 "ref_number": "087-26",
 "title": "2026 Vegetation Removal
 (Non-Line Clearance)",
 "buyer": "Lincoln Electric Systems",
 "agency": "Lincoln Electric Systems",
 "status": "Open for Bidding",
 "due_date": "2026-08-04",
 "due_date_raw": "8/4/2026 2:00 PM",
 "posting_date": "2026-07-16",
 "bid_type": "Formal",
 "categories": "C820, L100, M350...",
 "state": "NE",
 "detail_url": "https://les.procureware.com/
 Bids/df4ace3c-0ac4-4747-9cdc-f867bfe3bbf7",
 "description": "",
 "contact": "LES Procurement Department;
 procurementdept@les.com; All questions must be
 submitted through this bid portal under the
 \\"Clarifications\\" tab.",
 "documents_gated": true,
 "_detail_ok": true
}`],notes:["Look at description. The detail page opened fine, and there was still no scope text on it. All five Lincoln Electric bids that night came back the same way."],tables:[]}],notes:["The dangerous failure here is a quiet one. If the browser library cannot be loaded, the engine does not crash. It writes an empty snapshot with an error note, returns normally, and the rest of the run compiles a clean-looking zero-bid day. Worse, the usual protection that merges yesterday's rows forward only runs over rows that are present, so an empty list wipes the snapshot, and the day's verdicts are then filtered against that empty list and wiped too. One missing browser erases both."],then:"compare against the last time we looked"},{n:"5",title:"The diff: what is genuinely new?",who:"platform_sweep.prep, called from run_daily.py",summary:["Tonight's 30 bid numbers are compared against the 31 numbers in the last day folder, daily/2026-07-23/triage.json. Anything seen before keeps the decision it already had. Only the truly new numbers go to the AI.","Five were new, all five from the New Orleans transit board. Bid A and Bid B were not among them; they arrived as carryover with decisions already attached."],cells:[{label:"Out",paths:[{path:"runs/triage-input.json",size:"1,103 bytes · 5 rows"},{path:"runs/triage-carryover.json",size:"3,405 bytes · 25 rows"},{path:"runs/judge-input.json",size:"37,555 bytes · 30 rows"},{path:"runs/_funnel.json",size:"152 bytes"}],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 30,
 "carryover_count": 25,
 "triage_input_count": 5,
 "prior_archive_ids_compared_against": 31
}`],notes:[],tables:[]},{label:"Real records Bid A, carriedBid B, judge blob",paths:[],blocks:[`{
 "idx": 21,
 "bid_id": "085-26",
 "decision": "SKIP",
 "reason": "steel fabrication, not veg/tree"
}`,`{
 "idx": 13,
 "bid_id": "087-26",
 "title": "2026 Vegetation Removal
 (Non-Line Clearance)",
 "buyer": "Lincoln Electric Systems",
 "state": "NE",
 "due_date": "2026-08-04",
 "detail_url": "https://les.procureware.com/
 Bids/df4ace3c-0ac4-4747-9cdc-f867bfe3bbf7",
 "description_full": "Title: 2026 Vegetation Removal
 (Non-Line Clearance)\\nBuyer: Lincoln Electric Systems
 \\nState: NE\\nCloses: 2026-08-04\\nSource URL: https://
 les.procureware.com/Bids/df4ace3c-…\\n\\nRFP body
 (truncated to 6KB):\\n"
}`],notes:['The blob ends at "RFP body (truncated to 6KB):" with nothing after it. For 24 of the 30 rows there is real scope text below that line. For Bid B there is not.'],tables:[]}],notes:["Two traps in the diff key. The key is the solicitation number as printed on the board, a human string like 087-26 or RFQ RTAR_3557- 2 (REBID). A board that changes how it numbers things would make its whole list look new. And the lookup for the previous day includes today, so re-running the same day gives zero new bids."],then:"five titles go to the first AI pass"},{n:"6",title:"Triage: the only decisions made on 28 July",who:"max-triage · AI, writes runs/triage-verdicts.json",summary:["An agent reads the title, buyer, state and due date of each new bid and answers OPEN or SKIP. The default is SKIP. OPEN only for a plain LGS-shaped verb or a cryptic utility buyer worth a second look.","All five new bids were New Orleans transit purchases: training material, motor oil, a gear part, refrigerant, a social media platform. All five got SKIP. That is the entire list of decisions made that night."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"1,103 bytes · 5 rows"},{path:"runs/triage-verdicts.json",size:"584 bytes · 5 rows, all SKIP"}],blocks:[`{
 "idx": 8,
 "bid_id": "RFQ RTAR_03961",
 "title": "Synthetic Motor Oil",
 "buyer": "New Orleans Regional Transit
 Authority (RTA)",
 "state": "LA",
 "due_date": "2026-07-30"
}`,`{
 "bid_id": "RFQ RTAR_03961",
 "decision": "SKIP",
 "reason": "Commodity fluid purchase"
}`],notes:[],tables:[]},{label:"All five verdicts written that night",paths:[],blocks:[`RFQ RTAR_03915 SKIP Training curriculum design, no LGS verb
RFQ RTAR_03961 SKIP Commodity fluid purchase
RFQ RTAR_03969 SKIP Inventory gear part, transit buyer not utility
RFQ RTAR_03962 SKIP Commodity refrigerant purchase
RFQ RTAR_3557- 2 SKIP Software/SaaS platform
(REBID)`],notes:['Where the 2 OPEN in stats.json come from. Not from here. They are the two rows in runs/triage-carryover.json that already said OPEN: Bid B ("vegetation removal, Cat 2 core") and the McAllen palm bid 08-26-S102-168 ("Tier A tree trimming, city buyer"). No new bid was opened on 28 July.'],tables:[]}],notes:[],then:"the sweep asks for extra detail on the OPENs"},{n:"7",title:"Enrich the OPENs: this does nothing, on purpose",who:"ps.enrich_opens(PORTAL, config, open_ids)",summary:['The shared plumbing asks the engine for a "go fetch more detail" function. This engine does not have one, so the call returns zero and moves on. That is fine here, because the detail pages were already opened back at the pull.',"The price of that design is paid earlier: 30 detail-page visits instead of the 2 that triage would have asked for. The gain is that the judge sees real scope text on the first pass without going back to the site."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json",size:"read"},{path:"nothing written",size:"the function returns 0"}],blocks:[],notes:["Neither of the other two ports-and-airports platforms ever opens a detail page at all: on the snapshots on disk today _detail_ok is false on every row of both, against 29 of 30 here. bonfire-ports ends up with no description on any of its 40 rows; opengov-ports has to take its text off the list page, and gets it on 11 of 12."],tables:[]}],notes:[],then:"which OPENs still need a score?"},{n:"8",title:"Pick the OPENs that still need a verdict",who:"ps.build_judge_input_open(PORTAL)",summary:["This keeps tonight's new OPENs, plus any OPEN carried over from an earlier day that was never scored, and drops anything already scored before. It exists so a bid cannot sit OPEN forever without a verdict.","On 28 July there were no new OPENs, and both carryover OPENs already had verdicts: Bid B was scored on 20 July, the McAllen palm bid on 23 July. So the list came out empty."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json",size:"5 rows, all SKIP"},{path:"runs/triage-carryover.json",size:"25 rows, 2 of them OPEN"},{path:"daily/2026-07-23/verdicts.json",size:"both OPENs already scored"},{path:"runs/judge-input-open.json",size:"2 bytes · 0 rows"}],blocks:[],notes:[],tables:[]},{label:"The two carryover OPENs, and the file they produced",paths:[],blocks:[`{
 "bid_id": "087-26",
 "decision": "OPEN",
 "reason": "vegetation removal, Cat 2 core"
}
{
 "idx": 24,
 "bid_id": "08-26-S102-168",
 "decision": "OPEN",
 "reason": "Tier A tree trimming, city buyer"
}`,"[]"],notes:["Two bytes. An empty list is literally two characters on disk."],tables:[]}],notes:[],then:"nothing to score, so nothing is scored"},{n:"9",title:"The judge: not called at all on 28 July",who:"max-bid-judge · AI, writes runs/judge-verdicts.json",summary:["Normally an agent reads each OPEN bid with its scope and returns yes, maybe or no, with a score out of 100, a category and a reason. On this run it had nothing to read, so runs/judge-verdicts.json was written as an empty list.","That is correct behaviour, not a broken stage. Both live OPENs were scored on earlier runs, Bid B on 20 July and the McAllen palm bid on 23 July, and their scores are still valid. Below is the verdict Bid B is still carrying, and it is worth reading closely."],cells:[{label:"Out",paths:[{path:"runs/judge-verdicts.json",size:"2 bytes · 0 rows"}],blocks:[],notes:["Score 80 from a title alone. Bid B's description was empty at the pull, so the judge saw a title, a buyer, a state and a closing date. It scored 80 anyway, because a verbatim vegetation-removal title from a municipal electric utility is a pattern LGS wins. Then it wrote its own warning into the record: thin_description_pull_rfp_packet and documents_gated_registration_required. The machine labelled the weakness of its own input."],tables:[]},{label:"Real record Bid B, YES 80, decided 20 July",paths:[],blocks:[`{
 "bid_id": "087-26",
 "title": "2026 Vegetation Removal
 (Non-Line Clearance)",
 "buyer": "Lincoln Electric Systems",
 "state": "NE",
 "would_lgs_bid": "yes",
 "verdict": "yes",
 "score": 80,
 "lgs_score": 80,
 "category": "Category 2 - Utility Vegetation
 / Removal",
 "primary_reason": "Verbatim vegetation removal
 title from a municipal electric utility is the
 Category 2 core pattern LGS wins repeatedly, and
 a strong title outweighs a gated, thin
 description.",
 "red_flags": [
 "thin_description_pull_rfp_packet",
 "documents_gated_registration_required",
 "out_of_core_state_NE",
 "non_line_clearance_scope_clarify_on_pull"
 ],
 "due_date": "2026-08-04",
 "source_url": "https://les.procureware.com/
 Bids/df4ace3c-0ac4-4747-9cdc-f867bfe3bbf7"
}`],notes:["Both naming styles are present, would_lgs_bid and verdict, score and lgs_score. The agent answers in one shape and the write step fills the other."],tables:[]}],notes:[],then:"everything is folded into one dated folder"},{n:"10",title:"Write the day folder",who:"ps.compile_archive(PORTAL, config)",summary:["Carryover decisions and tonight's new ones are merged into one triage list. Every prior verdict whose bid is still in tonight's snapshot is carried forward. Each verdict row is normalised so both naming styles are filled. Then the folder is written and a row is added to the archive index.","This is where the two YES bids reappear without the judge running: they were pulled forward from 23 July because their bid numbers are still in the 30-row snapshot."],cells:[{label:"Out · data/ebid-systems-ports/daily/2026-07-28/",paths:[],blocks:[],notes:["Two name traps. new-bids.json is not the new bids, it is the whole snapshot, byte for byte the same size as bids/all-bids.json. And endpoint in stats.json is always empty for this portal, because the compile step looks for a single entity_url and this config uses a tenants list. The real address survives only in bids/index.json."],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","30 rows, the full snapshot","42,224 B"]},{header:!1,cells:["triage.json","30 decisions, 2 OPEN","4,011 B"]},{header:!1,cells:["verdicts.json","2 rows, both YES, both carried","2,828 B"]},{header:!1,cells:["stats.json","the funnel counts","424 B"]},{header:!1,cells:["report.md","human summary","1,527 B"]}]]},{label:"The real stats.json for the night",paths:[],blocks:[`{
 "date": "2026-07-28",
 "source": "ebid-systems-ports",
 "engine": "ebid_systems",
 "endpoint": "",
 "snapshot_total": 30,
 "carryover_count": 25,
 "new_to_triage": 5,
 "triage": {
 "open": 2,
 "skip": 28,
 "total": 30
 },
 "scoring": {
 "yes": 2,
 "maybe": 0,
 "no": 0,
 "total": 2
 },
 "verdicts_unresolved": 0,
 "generated_at": "2026-07-28T20:47:00.220879+00:00"
}`],notes:["The scoring block is the live verdict set, not tonight's work. It is a running total, which is exactly why the daily roll-up rules forbid adding it up across days."],tables:[]}],notes:[],then:"the portal's own night is over, the shared machinery starts"},{n:"11",title:"The shared safety net skips this portal",who:"2.5 · python scripts/carry_forward_verdicts.py --all",summary:[`Across the system there is a safety net that rescues verdicts for bids that fell out of a night's pull. It only runs for portals whose registry entry says carry_forward: "orchestrator". This one says "engine-internal", so the script never touches it.`,"In plain words: this portal does its own carrying forward, inside the compile step you just read. Running the shared net as well would apply the same merge twice."],cells:[{label:"What that costs, and one odd consequence",paths:[],blocks:[],notes:["Confirmed on this run. The New Orleans board supplied 8 of the 30 open bids, and all five of the night's new bids. Both slugs see them."],tables:[[{header:!1,cells:["Where the carrying actually happens","inside compile_archive: triage decisions merged, then prior verdicts filtered to bids still in tonight's snapshot"]},{header:!1,cells:["How it differs from the shared version",`the engine drops a verdict the moment its bid leaves the snapshot; the shared script keeps it and stamps a "not in today's snapshot" flag`]},{header:!1,cells:["The registry oddity","the standalone norta slug covers the same New Orleans ProcureWare board and is set to orchestrator. The same bids are pulled twice and carried forward two different ways under two names."]}]]}],notes:[],then:"ledgers, reports and the board file"},{n:"12",title:"All-time ledger, tidy report, board file",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared steps in a row. The all-time YES ledger is rebuilt by walking every day folder of every portal. The engine's own compact report is thrown away and rewritten in the shared layout. Then every bid this portal ever judged YES is flattened into one record per bid, which is the file the database publisher reads.","That last step is where the buyer contact is lost."],cells:[{label:"Out",paths:[{path:"data/portals/cumulative-yes.json + .md",size:"all-time YES"},{path:"daily/2026-07-28/report.md",size:"1,527 bytes, rewritten 22:37:27 UTC"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"3 rows for this portal"}],blocks:[],notes:['Two YES in the archive, three on the board. Both numbers are right. The board file walks every day folder ever, so 080-26, an older Lincoln Electric vegetation removal that has since closed and left the snapshot, is still a card. "YES tonight" and "YES on the board" are different questions.'],tables:[]},{label:"Real board record Bid B as a card",paths:[],blocks:[`{
 "id": "8229434a2b45ba6e",
 "portal": "ebid-systems-ports",
 "portal_label": "eBid / ProcureWare",
 "source_bid_id": "087-26",
 "title": "2026 Vegetation Removal
 (Non-Line Clearance)",
 "buyer": "Lincoln Electric Systems",
 "state": "NE",
 "solicitation_no": null,
 "score": 80,
 "verdict": "yes",
 "due_date": "2026-08-04",
 "contact_name": null,
 "contact_email": null,
 "contact_phone": null,
 "first_seen": "2026-07-20",
 "last_seen": "2026-07-28",
 "has_documents": true
}`],notes:["Checked live in the current fixture: all three rows for this portal carry contact_name, contact_email, contact_phone and solicitation_no as null."],tables:[]}],notes:["The contact is dropped here, and it is a field-name mismatch, not a scraping failure. The engine captured a contact on 22 of the 30 bids, as one block of text: name, phone and email together. The flattener only looks for three separate fields called contact_name, contact_email and contact_phone. It finds none of them, so all three land empty. The same mismatch empties solicitation_no: the number is written into ref_number and copied into bid_id, and neither of those names is on the list the flattener reads."],then:"the bid stops belonging to one portal"},{n:"13",title:"Onto the shared board, and grouped with everyone else's copies",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["Every YES row is pushed into one shared bids table, then bids with the same tidied-up title and state, and a compatible buyer or closing date, are grouped into one cluster. So a solicitation seen on this board and on BidNet becomes one row for the operator instead of two.","All three of this portal's board bids also arrive through BidNet. The stage model traces what happens to each, by running the same tidy-up rules the code uses."],cells:[{label:"Where the three land, per the stage model",paths:[],blocks:[],notes:['The portal with the right answer loses. "Texas municipality" is not an agency, it is a guess written by a scoring agent. This board captured the real buyer from the page and is the one that gets split off. The merge claims above are traced in docs/portal-dataflow/ebid-systems-ports.md with file and line references; the null solicitation number is the part this page checked on disk.'],tables:[[{header:!0,cells:["Bid","What happens"]},{header:!1,cells:["The two Lincoln Electric vegetation removals","they do merge with their BidNet twins: the titles tidy down to the same text, the closing dates match, and BidNet's buyer is blank, so the blank-buyer rule joins them on the date"]},{header:!1,cells:["The McAllen palm-tree bid",'it does not merge. BidNet publishes the buyer as "Texas municipality", this board has the correct "City of McAllen", and the splitter pulls two distinct buyers back apart after the join. Only an explicit AI "same bid" ruling can put them back together.']},{header:!1,cells:["The second dedup key","cannot rescue it, because solicitation_no is null on all three rows. Confirmed live in the current fixture."]}]]}],notes:[],then:"the board tries to fill what the portal could not"},{n:"14",title:"Documents and requirements: there are no documents",who:"2.87 · extract_doc_text.py → build_bidpack.py → requirements-extractor → apply_requirements.py",summary:["Normally this stage pulls the text out of every bid document, builds a reading pack, and has an agent write down what the bid actually requires, quoting the source for each line.",'This portal contributes no documents at all. The files behind a ProcureWare bid need a free vendor sign-up on each separate agency board, so the engine never downloads them and stamps documents_gated: true on every row instead. All 30 rows that night carried the flag. The requirements agent therefore reads whatever description was captured, or records a neutral "no material" row.'],cells:[{label:"What the agent has to work with",paths:[],blocks:[],notes:["This is the contact's second chance. The requirements step backfills a contact when a bid has none, and every bid from this portal has none. It is the only route by which the name, phone and email already sitting in the snapshot can reach the board."],tables:[[{header:!1,cells:["Documents","0 of 30, all flagged as registration-gated"]},{header:!1,cells:["Description","24 of 30 rows, but 0 of the 5 Lincoln Electric rows"]},{header:!1,cells:["Contact","22 of 30 captured, 0 reaching the board"]}]]},{label:"The one bid with real scope text, from bids/all-bids.json",paths:[],blocks:[`"bid_id": "08-26-S102-168"
"description": "NOTICE TO RESPONDENTS

Solicitation Type and Name: Request for Proposals
for the Trimming and Peeling of Tall Palm Trees.

Solicitation Number: 08-26-S102-168

Description:The City of McAllen is seeking proposals
to establish a service contract for the trimming and
peeling of tall palm trees on various properties
throughout the City.…"`],notes:["Shortened at the end only. The McAllen board gives a full notice; the Lincoln Electric board gives nothing but a title and a contact."],tables:[]}],notes:[],then:"now that fields are filled, look for duplicates again"},{n:"15",title:"Second look for duplicates",who:"2.875 · llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["Filling in blank buyers, closing dates and solicitation numbers changes which pairs of bids can be compared at all. So the duplicate check runs a second time, on just that leftover.","This is the only place the McAllen split could still be healed, and only by an AI ruling that the two rows are the same bid. The underlying disagreement is a wrong buyer name on the other portal, and nothing in the enrichment step corrects that."],cells:[{label:"In → Out",paths:[{path:"shared clusters + the record of past duplicate rulings",size:"read"},{path:"data/portals/llm-dedup-candidates.json",size:"the pairs worth asking about"}],blocks:[],notes:[],tables:[]}],notes:[],then:"what changed, who gets told, did the run finish"},{n:"16",title:"Change checks, emails, and the run health check",who:"2.88 · watch_list_signals.py · bid_watch.py · new_bids_email.py · contracts_digest.py · pipeline_sentinel.py",summary:["Tonight's snapshot is compared with the last one for list-level changes, the operator is emailed what is new and what is closing, and a health check confirms the portal actually finished each stage.",'This portal has no deep watch mode. It does record a status word per bid, such as "Open for Bidding" or "Under Review", and that word can be diffed for free when a bid stops being open.'],cells:[{label:null,paths:[],blocks:[],notes:['One blind spot worth naming. If the browser library were missing, the pull would write zero bids and report success. The health check would need to read the error note in bids/index.json to tell "the boards are genuinely empty" apart from "the browser never started". Whether it does is an open question in the stage model.'],tables:[[{header:!1,cells:["Watch mode","none in the registry. No re-capture of the source page."]},{header:!1,cells:["Free change signal","the status word on each row, already in the snapshot"]},{header:!1,cells:["Emails: new bids, watch digest, deadline alerts, contracts digest","silently do nothing until an email key is set in data/auth/resend.env"]},{header:!1,cells:["Health check","writes data/portals/sentinel.json"]}]]}],notes:[],then:null}],d=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["A real browser is a hard requirement, and its absence is silent","the board is drawn by JavaScript. With no browser library the engine writes a zero-bid snapshot and exits clean, which also wipes the day's live verdicts, because they are filtered against that empty snapshot"]},{header:!1,cells:["The captured contact never reaches the board","22 of 30 rows had a contact on 28 July. The board shows contact coverage 0%, because the engine writes one text block and the publish chain reads three separate fields. The runbook already reported 0% coverage; the cause is a field name, not a wall"]},{header:!1,cells:["Documents are behind a free sign-up on every separate agency board","0 documents, ever. documents_gated: true on all 30 rows, so the gap is at least explicit rather than a blank"]},{header:!1,cells:["The solicitation number is stored under a name nobody reads","it sits in ref_number and bid_id; the board's solicitation_no is null on all 3 rows, so the second duplicate-matching key can never fire for this portal"]},{header:!1,cells:["The bid key is a printed number like RFQ RTAR_3557- 2 (REBID)","readable, but a board that reformats its numbering makes its whole list look brand new. There is also a last-resort key of host plus row position, which would change every single day if it ever fired"]},{header:!1,cells:["The 50-row page limit is worked around, not removed","the engine tells the grid to load everything. If that fails it reads the default first 50 rows and quietly loses the rest. McAllen has over 1,200 rows behind the filter, so this matters"]},{header:!1,cells:["new-bids.json is not the new bids","it is the full snapshot, identical in size to bids/all-bids.json. On 28 July it held 30 rows while only 5 bids were new"]},{header:!1,cells:["endpoint in stats.json is always empty","the compile step looks for a single address; this config holds a list of boards. The real address survives only in bids/index.json"]},{header:!1,cells:["scoring.yes in stats.json is a running total","it is the live carried-forward verdict set, not that day's work. Adding it across days double-counts, which is why the roll-up rules forbid it"]},{header:!1,cells:["The New Orleans board is covered twice","it is a tenant here and also its own portal slug with the opposite carry-forward setting. Same bids, two names, two cadences, two ways of being carried forward"]},{header:!1,cells:['State is hardcoded as "multi" on the monitor board',"every row renders as outside the core states, including the Louisiana and Texas bids that are inside the footprint"]},{header:!1,cells:["The config file on disk no longer matches the run","committed: 7 tenants. Working copy today: 3. The 28 July run used 7. The four absent boards supplied 17 of the 30 open bids and carry the score-80 YES"]},{header:!1,cells:["The stage model is written against 23 July","it cites 31 bids, 8 new, 23 carried, contact 24 of 31. The anchor run is 30 / 5 / 25 / 22 of 30. The files win; the model needs regenerating"]},{header:!1,cells:["17 agencies were fingerprinted as this platform and are not","the 6 checked link to no ProcureWare board at all, and the other 11 share a corrupted duplicate address, so their real purchasing pages were never resolved"]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to daily/2026-07-28/stats.json, a row count, a byte size, or a line of logs/pull_log.txt. Baseline map: docs/portal-dataflow/ebid-systems-ports.md, which is evidence-cited to file and line but was written against the run of 23 July and is stale on every count. Companion pages: Portal pedia · 01 (BidNet), · 02 (DemandStar)."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to daily/2026-07-28/stats.json, a row count, a byte size, or a line of logs/pull_log.txt. Baseline map: docs/portal-dataflow/ebid-systems-ports.md, which is evidence-cited to file and line but was written against the run of 23 July and is stale on every count. Companion pages: Portal pedia · 01 (BidNet), · 02 (DemandStar).",c="docs/portal-dataflow/pedia-ebid-systems-ports.html",p={slug:e,title:t,eyebrow:s,headline:a,lede:n,funnel:o,funnel_note:r,legend:i,stages:l,sections:d,footer:h,source_page:c};export{p as default,s as eyebrow,h as footer,o as funnel,r as funnel_note,a as headline,n as lede,i as legend,d as sections,e as slug,c as source_page,l as stages,t as title};
