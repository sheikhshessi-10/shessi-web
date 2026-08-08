const e="ms-dfa",t="Mississippi DFA: what happens to a bid, stage by stage",s="Portal pedia · 26",a="Mississippi DFA: the night every new bid was thrown out",n="Every stage of the run of 28 July 2026, with a real record from the actual files at each step. Mississippi's state bid board answers one public web call with the whole open list. That night it handed back 170 bids, 50 of them new, and Pass 1 said SKIP to all fifty. Not one new bid reached the scoring stage.",i=[{value:"170",label:"in snapshot"},{value:"120",label:"carried over"},{value:"50",label:"new tonight"},{value:"19",label:"triage open"},{value:"151",label:"triage skip"},{value:"1",label:"scored yes"}],r='Counts from data/ms-dfa/daily/2026-07-28/stats.json (658 bytes) and data/ms-dfa/runs/_funnel.json (185 bytes). Two of these numbers need a warning label. All 19 OPENs were carried in from earlier days. None of the 50 new bids was opened. And the 1 yes was not judged that night at all; it was re-published from a file last written four days earlier. The full story is at stages 6 and 7. The written model is behind the disk. docs/portal-dataflow/ms-dfa.md says "126-146 open bids per run" and proves its coverage sum with 52 new + 94 carried = 146 from the 24 July run. On 28 July the numbers are 50 + 120 = 170. The stage shapes in that doc still hold; its volumes do not.',o=["Bid A · 46049 · Mississippi State University, sole-source process automation system. SKIP.","Bid B · 46030 · MPTAP / City of Jackson, right-of-way and vegetation. YES, score 91.","Bid C · 46069 · Warren County watershed protection. YES, score 66. The only row in the scoring file, and it is four days old."],d=[{n:"0",title:"Is Mississippi due today?",who:"scripts/portal_due.py --batch portals",summary:["This portal does not run nightly. It runs on a three-day beat. The gate looks at the newest folder under data/ms-dfa/daily/ and, if it is three or more days old, prints the slug so the sweep gets dispatched.","The previous folder was 2026-07-24. Four days old on the 28th, so Mississippi was due."],cells:[{label:"In → Out",paths:[{path:"data/portals/registry.json",size:"cadence_days: 3, batch: portals"},{path:"data/ms-dfa/daily/*",size:"42 dated folders on record"},{path:"stdout",size:"one slug per line"}],blocks:[],notes:[],tables:[]},{label:"The registry row for this portal",paths:[],blocks:[`{
 "slug": "ms-dfa",
 "label": "Mississippi DFA",
 "engine": "",
 "batch": "portals",
 "cadence_days": 3,
 "authed": false,
 "enrich_passes": [],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "orchestrator"
}`],notes:["The engine field is empty because this portal has its own hand-written scripts rather than a shared platform engine. Every number on this card comes from that row."],tables:[]}],notes:["The registry file is the fallback, not the boss. The live cadence is read from the board database first (scripts/portal_registry.py:56); the call is wrapped in a try/except and falls back to registry.json if it fails (scripts/portal_registry.py:61-62). Changing the beat from the front end really does change how often Mississippi runs."],then:"the slug is printed, so a child agent is started"},{n:"1",title:"Hand the whole sweep to a child",who:"Agent reads .claude/skills/ms-dfa-sweep/SKILL.md and runs it",summary:["Mississippi is in the first batch of the all-portals run, started in parallel with BidNet, DemandStar, myvendorlink and NAPC. The child agent owns everything from the pull through to writing the day's folder. Nothing is shared until it finishes.","If the child falls over, the roll-up marks this portal FAILED and the other portals in the batch carry on (.claude/skills/portals/SKILL.md:195)."],cells:[{label:"What the child ran that night, in file-write order",paths:[],blocks:[`18:17:12 UTC bids/all-bids.json + bids/index.json pull
 13:17 runs/_funnel.json, triage-input.json,
 triage-carryover.json diff
 13:21 runs/triage-verdicts.json Pass 1
 13:22 runs/judge-input-enriched.json,
 runs/pdfs/_summary.json PDF fetch
 13:22 daily/2026-07-28/{new-bids,triage,
 verdicts,stats}.json + report.md compile
 17:35 daily/2026-07-28/verdicts.json rewritten,
 _carryforward_audit.json carry-forward
 17:37 daily/2026-07-28/report.md rewritten standardize`],notes:["Clock times are the file timestamps on disk, local time except the pull, which stamps UTC inside bids/index.json. Notice what is missing from this list: runs/judge-verdicts.json. It was never written. Stage 6 explains."],tables:[]}],notes:[],then:"one cookie, one web call, the whole open list"},{n:"2",title:"Pull the whole open snapshot",who:"data/ms-dfa/scripts/pull_bids.py",summary:["Load a page to pick up the session cookie, then send one form post to the grid endpoint. Back comes every open bid in Mississippi, with buyer contact, dates and attachment links already attached. 8.29 seconds, no login, no browser.","Before saving, the script builds a set of extra fields on each row from what the grid already gave it: a detail link, ISO dates, a contact, a document list, a due date and a description. So the snapshot is complete without a single extra fetch."],cells:[{label:"In → Out",paths:[{path:"ms.gov/dfa/contract_bid_search/Bid?autoloadGrid=true",size:"for the cookie"},{path:"ms.gov/dfa/contract_bid_search/Bid/BidData?AppId=1",size:"the JSON grid"},{path:"data/ms-dfa/bids/all-bids.json",size:"556,550 bytes · 170 rows · 51 fields"},{path:"data/ms-dfa/bids/index.json",size:"230 bytes"}],blocks:[`{
 "source": "ms_dfa",
 "endpoint": "https://www.ms.gov/dfa/
 contract_bid_search/Bid/BidData?AppId=1",
 "pulled_at": "2026-07-28T18:17:12.784357+00:00",
 "iTotalRecords": 170,
 "rows_written": 170,
 "elapsed_s": 8.29
}`],notes:[],tables:[]},{label:"Real record Bid A 18 of its 51 fields",paths:[],blocks:[`{
 "BidID": 46049,
 "BidNumber": "9250-27-R-RFIN-00005",
 "BidDescription": "SOLE SOURCE REQUEST TO
 PURCHASE FluidMechantronix Process
 Automation System",
 "Agency": "MISSISSIPPI STATE UNIVERSITY",
 "BidStatus": "Open",
 "BidType": "Req. for Information",
 "ProcurementCategoryDescription": "COMMODITIES",
 "BuyerName": "Debra Raines",
 "BuyerEmail": "draines@procurement.msstate.edu",
 "AdvertiseDate": "/Date(1784869200000)/",
 "SubmissionDate": "/Date(1786078800000)/",
 --- fields this script derives ---
 "advertise_date_iso": "2026-07-24",
 "due_date": "2026-08-07",
 "contact_name": "Debra Raines",
 "contact_email": "draines@procurement.msstate.edu",
 "documents": [{"file_name": "N.pdf", …}],
 "description": "CONTACT: Debra Raines ·
 draines@procurement.msstate.edu\\n\\nSOLE SOURCE
 REQUEST TO PURCHASE FluidMechantronix…",
 "bidUrl": "https://www.ms.gov/dfa/
 contract_bid_search/Bid/Details/46049?AppId=1"
}`],notes:[],tables:[]}],notes:["Look at what is not in those 51 fields: a title. There is no title key anywhere in this file. Everything downstream that wants a title has to make do with BidDescription, which the portal itself caps at 255 characters (pull_bids.py:145-150). That single missing key comes back to bite at stage 9, and the 255-character cap is why the real scope only ever lives inside the attachment PDFs.","The snapshot is overwritten every run, which is safe only because every derived field is rebuilt from the grid row each time (pull_bids.py:165-192). The PDF text pulled at stage 5 is deliberately kept out of this file so it cannot be wiped (pull_bids.py:170-172)."],then:'split the 170 into "already decided" and "needs the AI"'},{n:"3",title:"Diff against the last run",who:"data/ms-dfa/scripts/prep_bids.py",summary:["Take today's 170 bids and check each one against the last archived day. A bid decided before keeps its old OPEN or SKIP, copied straight across. Everything else goes to the AI. On this run: 120 copied, 50 sent on.","This is the portal's own carry-forward and it happens at Pass 1. There is a second, different carry-forward later at stage 8 for the scoring pass. Different files, different pass, so nothing is applied twice."],cells:[{label:"In → Out",paths:[{path:"data/ms-dfa/bids/all-bids.json",size:"170 rows"},{path:"data/ms-dfa/daily/2026-07-24/triage.json",size:"146 prior decisions"},{path:"runs/triage-input.json",size:"19,909 bytes · 50 rows"},{path:"runs/triage-carryover.json",size:"17,611 bytes · 120 rows"},{path:"runs/_funnel.json",size:"185 bytes"}],blocks:[`{
 "snapshot_total": 170,
 "triage_input_count": 50,
 "carryover_count": 120,
 "keyword_passing": 50,
 "new_since_last_archive": 50,
 "prior_archive_verdicts_loaded": 146
}`],notes:["The sums check out: 50 + 120 = 170 = the snapshot = the day's triage file. keyword_passing is not a keyword count. It is just the new-bid count under an old name (prep_bids.py:82). This pipeline has no keyword gate."],tables:[]},{label:"Both tracers land in the carryover file, not the new list",paths:[],blocks:[`{
 "BidID": 46049,
 "decision": "SKIP",
 "reason": "sole-source commodity purchase",
 "carried_over_from": true
}`,`{
 "BidID": 46030,
 "decision": "OPEN",
 "reason": "no scope signal — needs PDF
 (pre-bid conference boilerplate)",
 "carried_over_from": true
}`],notes:["Of the 120 carried rows, 101 are SKIP and 19 are OPEN. Those 19 are the entire OPEN population of the night. Bid B is one of them."],tables:[]}],notes:["A known trap that did not fire this run. run_daily.py:70-72 exits cleanly and stops the whole sweep when the new count is zero, which would leave any never-scored OPEN stranded. It has been unpatched since 31 May 2026. On 28 July the new count was 50, so the run continued normally."],then:"50 rows of six fields go to the AI"},{n:"4",title:"Pass 1: keep or drop",who:"max-triage · AI, verdicts written by the child agent",summary:["One batched call. For each new bid the AI sees six fields: the id, the title, the agency, the state, the bid type and the buying category. It answers OPEN or SKIP with a short reason. The default is SKIP unless the title names work Looks Great Services actually does.",`All 50 came back SKIP. By buying category the fifty split 29 construction, 10 commodities, 7 personnel services, 4 IT. Construction is the biggest group, and reading its 29 reasons back off disk splits it in two. 15 name real work that is structurally not this company's: roads, paving, bridges, a hangar, barracks, a landfill cell, a school re-roof, a nursing home, park renovations (.claude/skills/ms-dfa-sweep/SKILL.md:106). The other 14 say the same thing word for word — "truncated boilerplate, CONSTRUCTION, lean SKIP per v3 rule" — meaning there was no readable scope at all and the default-SKIP rule applied (.claude/skills/ms-dfa-sweep/SKILL.md:102). That is the 255-character cap from stage 2 deciding bids. The remaining 21 are sole-source purchases, IT buys and admin services. Not one new bid opened.`],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"19,909 bytes · 50 rows"},{path:"runs/triage-verdicts.json",size:"5,926 bytes · 50 rows · all SKIP"}],blocks:[`{
 "BidID": 46131,
 "title": "SOLE SOURCE REQUEST TO PURCHASE
 Custom-built research plot sprayer manufactured
 by R&D Sprayers, designed for attachment to a
 sub-compact tractor. The unit includes multi-
 tank/bottle configurations, adjustable boom syste",
 "agency": "MISSISSIPPI STATE UNIVERSITY",
 "state": "Mississippi",
 "bid_type": "Req. for Information",
 "procurement_category": "COMMODITIES"
}`],notes:['That "title" is not a title. It is the description field, cut off mid-word at "syste". Because the snapshot has no title key, this is what Pass 1 reads on every Mississippi bid.'],tables:[]},{label:"Real verdicts: the first three of fifty all SKIP",paths:[],blocks:[`{
 "BidID": 46131,
 "decision": "SKIP",
 "reason": "sole source sprayer, COMMODITIES"
}`,`{
 "BidID": 46057,
 "decision": "SKIP",
 "reason": "sole source antenna repair, COMMODITIES"
}`,`{
 "BidID": 46034,
 "decision": "SKIP",
 "reason": "IT category, no LGS verb"
}`],notes:["SKIP is final. There is no retry and no second look for a bid rejected here (.claude/skills/ms-dfa-sweep/SKILL.md:48). Fifty bids, fifty title reads, and that is the entire cost of the new work this run."],tables:[]}],notes:[],then:"only fresh OPENs get their PDFs downloaded, and there were none"},{n:"5",title:"Go get the real scope",who:"data/ms-dfa/scripts/fetch_pdfs_for_opens.py",summary:["This is the stage that rescues Mississippi from its own 255-character description limit. For each fresh OPEN it downloads the synopsis sheet plus every attachment, pulls the text out with pdfplumber, and glues it onto the description so the scorer sees the real job instead of a stub.","This run it did nothing, and that was correct. Pass 1 produced zero OPENs, so there was nothing to fetch. The script wrote an empty file and returned."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json",size:"50 rows, 0 OPEN"},{path:"runs/judge-input-enriched.json",size:"2 bytes · the text []"},{path:"runs/pdfs/_summary.json",size:"60 bytes"}],blocks:[`{
 "open_bids": 0,
 "fetched": 0,
 "pages_total": 0
}`],notes:[],tables:[]},{label:"Why no OPEN was left behind",paths:[],blocks:[`carried OPENs on 2026-07-28 .............. 19
of those, already carrying a score ....... 19
OPENs with no score anywhere .............. 0`],notes:["This script only reads the fresh Pass-1 verdicts, so the 19 carried-over OPENs never enter it. That is not a leak. Checked bid by bid against the day's final verdicts file:","Every one of the 19 was scored on an earlier day. Their _first_judged stamps are 16 July (1), 20 July (7) and 21 July (10). The nineteenth is bid 46069, whose stamp now reads 28 July only because stage 8 rewrote it; it was really scored on 24 July. There was no work for this stage to do."],tables:[]}],notes:["The folder underneath is a museum. runs/pdfs/ holds 155 per-bid folders. 126 of them were written on 24 May 2026 and the newest is from 24 July. Nothing prunes it, and it now mixes two generations of manifest file with different shapes. This run added nothing to it."],then:"the scorer had an empty inbox"},{n:"6",title:"Pass 2: score it out of 100",who:"max-bid-judge · AI · did not run on 28 July",summary:["Normally the scorer reads the PDF-enriched OPENs and returns a yes, maybe or no with a score, a category, red flags and fit signals, then the child writes runs/judge-verdicts.json.","Its input was the empty file from stage 5, so it never ran. And runs/judge-verdicts.json was never rewritten. The copy sitting on disk is stamped 24 July 2026, 08:53. That is four days before this run. It holds one row."],cells:[{label:"The file that should have been rewritten",paths:[{path:"runs/judge-input-enriched.json",size:"2 bytes · []"},{path:"runs/judge-verdicts.json",size:"1,732 bytes · 1 row · last written 2026-07-24 08:53"}],blocks:[],notes:["There is no freshness check. Nothing compares this file's date to today's date, and nothing empties it at the start of a run. It simply sat there from the previous sweep, waiting for the next stage to pick it up as if it were new."],tables:[]},{label:"Real record Bid C · the one row in that file",paths:[],blocks:[`{
 "BidID": 46069,
 "would_lgs_bid": "yes",
 "score": 66,
 "category": "specialty_adjacent_ewp",
 "primary_reason": "NRCS Emergency Watershed
 Protection let in our home county backyard -
 bank stabilization and drainage is earthwork-
 adjacent work we've won before…",
 "service_match": "adjacent",
 "scale_match": "borderline",
 "buyer_match": "core",
 "red_flags": [
 "no_veg_or_debris_verbs_pure_erosion_control",
 "low_scale_inferred_single_road_group_
 30_day_contract",
 "single_county_or_corridor_lets_check_bundling",
 "cor_certificate_required_over_50k"
 ],
 "fit_signals": [
 "nrcs_ewp_emergency_watershed_protection_cat6",
 "mississippi_home_state_number_1_win_rate",
 "county_board_buyer_core_pattern",
 "free_docs_on_centralbidding",
 "group_11_implies_sibling_lets_to_bundle"
 ],
 "kansas_city_risk": false,
 "closed_award": false,
 "elaboration": "Warren County Board of Supervisors,
 sealed bids due 10:00 AM 08/13/2026 at Vicksburg
 purchasing dept… EWP Project 75(354), Group 11,
 Brabston Rd #2… 5% bid bond, 100% P&P bonds,
 MS COR required… if over $50K…"
}`],notes:['A real, good verdict. It was simply made on 24 July, not 28 July. The 24 July archive holds the same bid with "_first_judged": "2026-07-24".'],tables:[]}],notes:[],then:"compile reads that stale file and publishes it as tonight's work"},{n:"7",title:"Write the day's folder",who:"data/ms-dfa/scripts/compile_insights.py",summary:["Merge the 120 carried decisions with the 50 fresh ones into a single set of 170, pair them with whatever the scorer produced, and write the durable folder every downstream report reads.","The triage half is right: 19 OPEN and 151 SKIP, covering all 170. The scoring half is the stale file from stage 6, re-published as though it were tonight's."],cells:[{label:"Out · data/ms-dfa/daily/2026-07-28/",paths:[],blocks:[],notes:["The scoring block is compile-time only. It is counted from runs/judge-verdicts.json and nothing else (compile_insights.py:81-83). Stage 8 then appends 26 more verdicts to verdicts.json after this file is already written, so stats.json is stale the moment it is saved. This is exactly why the shared runbook forbids adding up each portal's scoring.yes into a total (.claude/skills/portals/SKILL.md:512)."],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","50 rows, the new delta only, not the 170-bid snapshot","162,512 B"]},{header:!1,cells:["triage.json","170 decisions, tomorrow's memory","23,534 B"]},{header:!1,cells:["verdicts.json","1 row at this point; 27 after stage 8","37,053 B"]},{header:!1,cells:["stats.json","the funnel counts","658 B"]},{header:!1,cells:["report.md","human summary, rewritten again at stage 9","2,337 B"]}]]},{label:"stats.json in full: two numbers to distrust",paths:[],blocks:[`{
 "date": "2026-07-28",
 "source": "ms_dfa",
 "endpoint": "https://www.ms.gov/dfa/
 contract_bid_search/Bid/BidData",
 "snapshot_total": 170,
 "keyword_passing": 50,
 "new_since_last_archive": 50,
 "triage": {"open": 19, "skip": 151, "total": 170},
 "scoring": {"yes": 1, "maybe": 0, "no": 0, "total": 1},
 "keyword_passing_by_category": {},
 "keyword_passing_by_procurement": {
 "CONSTRUCTION": 29,
 "PERSONNEL SERVICES NON-IT": 7,
 "COMMODITIES": 10,
 "INFORMATION TECHNOLOGY (IT)": 4
 },
 "verdicts_unresolved": 0,
 "generated_at": "2026-07-28T18:22:35.207369+00:00"
}`],notes:['scoring.total: 1 claims one bid was scored tonight. Zero were. keyword_passing: 50 claims a keyword gate that this pipeline deleted, and the report prints it under the heading "Passed LGS keyword gate (Pass 0)" (compile_insights.py:142).'],tables:[]}],notes:["One more file with a fossil in it. Compile also reads runs/keyword-passing.json as a cold-start fallback (compile_insights.py:70-71). That file is 2 bytes, contains [], and was written on 24 May 2026 by a one-off script that has not run since."],then:"the portal's own work is done. The shared machinery takes over"},{n:"8",title:"Carry forward, and this portal is in it",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:['The registry says carry_forward: "orchestrator", which means Mississippi is in the shared carry-forward set. In plain words: a bid scored once stays on the board on later runs, without being re-scored, until it is 90 days old, is re-scored, or is marked awarded.',"Tonight that step did the real work. The day's verdicts file went from 1 row to 27: 4 yes, 1 maybe, 22 no."],cells:[{label:"_carryforward_audit.json in full · 421 bytes",paths:[],blocks:[`{
 "portal": "ms-dfa",
 "ok": true,
 "skipped": false,
 "today": "2026-07-28",
 "prior_date_used": "2026-07-24",
 "today_new_judged": 1,
 "carried_forward": 26,
 "carried_forward_not_in_today_snapshot": 26,
 "dropped_too_old": 0,
 "dropped_already_judged_today": 1,
 "dropped_closed_award": 0,
 "final_total": 27,
 "final_yes": 4,
 "final_maybe": 1,
 "final_no": 22,
 "max_age_days": 90
}`],notes:["Read today_new_judged: 1 and dropped_already_judged_today: 1 together. They are the same bid, 46069, seen twice. The stale file made it look like tonight's work, so its genuine 24 July row was thrown away as a duplicate and its _first_judged stamp was rewritten to 2026-07-28. Nothing was lost, because 46069 was already live on the board from the 24th. But two counters now record judging that did not happen."],tables:[]},{label:"Real record Bid B · carried onto tonight's board",paths:[],blocks:[`{
 "BidID": 46030,
 "would_lgs_bid": "yes",
 "score": 91,
 "category": "vegetation management / ROW clearing",
 "primary_reason": "Core LGS scope: residential lot,
 right-of-way, and vegetation management services
 in Jackson, MS (LGS's #1 win-rate state).",
 "service_match": true,
 "red_flags": [
 "mandatory pre-bid conference 7/23 - must
 attend or non-responsive"
 ],
 "fit_signals": [
 "Right-of-Way Services",
 "Vegetation Management",
 "Residential Lots (lot clearing/cleaning)",
 "Public Works Services product category",
 "City of Jackson, Mississippi buyer"
 ],
 "_first_judged": "2026-07-21",
 "_carryforward_from": "2026-07-24",
 "_in_today_snapshot": false
}`],notes:["That last flag is wrong, and here is the proof. Bid 46030 is in tonight's snapshot. It is right there in bids/all-bids.json. The flag says false because the check looks at new-bids.json, which for this portal holds only the 50 new bids, not the 170-bid snapshot. It reads false on 26 of 26 carried rows. Nothing is dropped, but the flag and the carried_forward_not_in_today_snapshot count mean nothing here."],tables:[]}],notes:[],then:"ledger, report, board cards"},{n:"9",title:"Ledger, report, and the cards",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared steps in a row. The ledger walks every Mississippi day ever written and folds its YES bids into the all-portal running list. The report step rewrites report.md in the house layout, so the file has two writers in one run and this one wins. Then the card dump joins each YES verdict to its snapshot row for display.","Only YES bids become cards. Mississippi is not a federal feed, so MAYBE stays off the board."],cells:[{label:"Out",paths:[{path:"data/portals/cumulative-yes.json + .md",size:"all-portal YES ledger"},{path:"data/ms-dfa/daily/2026-07-28/report.md",size:"2,337 bytes · rewritten 22:37:27 UTC"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"6 ms-dfa cards"}],blocks:[`# ms_dfa — 2026-07-28

**Source:** https://www.ms.gov/dfa/contract_bid_search/
 Bid/BidData · engine \`\` · state <blank>

- Snapshot: **170** open bids
- Carryover: ? · NEW today: ?
- Triage: 19 OPEN / 151 SKIP
- Scored: **4 YES / 1 MAYBE / 22 NO**

## YES — Max would bid

- **[91] <blank>** — — · closes unknown
 Core LGS scope: residential lot, right-of-way…
- **[78] <blank>** — — · closes unknown
 Core LGS demolition and parcel cleaning work…
- **[66] 46069** — — · closes 2026-08-13
 NRCS Emergency Watershed Protection let in our…
- **[63] <blank>** — — · closes unknown
 Real removal-transport-disposal debris work on…`],notes:["All four YES lines, with each reason text cut short here. Carryover and NEW print as question marks; engine and state print blank; three of the four YES lines have no title, no buyer and no closing date. Only 46069 shows anything in the title slot, and what it shows is its own id. The scored line is right: 4 / 1 / 22 comes from the merged verdicts file, not from the stale stats.json."],tables:[]},{label:'Every Mississippi card on the board title "?"',paths:[],blocks:[`portal-bids.json · portal = ms-dfa · 6 cards
"?" 91 yes MPTAP
"?" 78 yes MS DEPT OF MARINE RESOURCES
"?" 78 yes MPTAP
"?" 75 yes MPTAP
"?" 66 yes MPTAP
"?" 63 yes MS DEPT ENVIRONMENTAL QUALITY`],notes:['This corrects the written model. ms-dfa.md describes the "?" title as an edge case for a bid that has aged out of every archive. It is not an edge case here. It is every card, every run. The card builder picks the title with v.get("title") or snap.get("title") or "?" (build_yes_excel.py:205), and the word title appears in neither the verdict rows nor the 51 snapshot fields. The description survives because its fallback chain reaches snap.get("BidDescription"). The title has no such fallback, so it lands on "?" one hundred percent of the time.'],tables:[]}],notes:[],then:"bids stop being a Mississippi file tree here"},{n:"10",title:"Publish, cluster, dedup",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["The cards are pushed into the shared board database and clustered with every other portal's bids, so one solicitation that appears on Mississippi DFA and also on BidNet or DemandStar becomes a single row for the operator. Then an AI pass proposes and applies cross-portal merges the clustering missed.","Tables touched: portals, bids, clusters, bids.cluster_id, bids.contact_*, sweep_runs."],cells:[{label:"Real card Bid B on the shared board",paths:[],blocks:[`{
 "id": "1bc87df6cb35ad9b",
 "portal": "ms-dfa",
 "source_bid_id": "46030",
 "title": "?",
 "buyer": "MPTAP",
 "state": "",
 "solicitation_no": "7-20260720131419 Jackson",
 "score": 91,
 "verdict": "yes",
 "category": "vegetation management / ROW clearing",
 "description": "CONTACT: Monica Oliver ·
 moliver@city.jackson.ms.us\\n\\nPre-Bid Conference:
 Date & Time: 7/23/2026 10:00 AM…",
 "due_date": "2026-07-28",
 "contact_name": "Monica Oliver",
 "contact_email": "moliver@city.jackson.ms.us",
 "first_seen": "2026-07-21",
 "last_seen": "2026-07-28",
 "has_documents": true
}`],notes:[],tables:[]},{label:"Two things on this card make deduping hard",paths:[],blocks:[],notes:[`One. solicitation_no is "7-20260720131419 Jackson", a timestamp with a city name glued on, taken straight from the portal's BidNumber. It is not the number the buyer uses. The real one is 96866-072826, and it appears only inside the attachment file name and the scorer's write-up. So the number this portal puts on the shared board will not match the number any other portal puts there for the same job.`,`Two. state is empty and the buyer is "MPTAP", an acronym, while the actual buyer named in the description and the scorer's reasoning is the City of Jackson. A human reading the board sees neither the real buyer nor the real title.`,"The description, contact and source link all survive intact, so the card is still usable. The operator clicks through. But the three fields a machine would match on are the three that are wrong."],tables:[]}],notes:[],then:"the board goes and fetches the paperwork"},{n:"11",title:"Documents, contacts, requirements",who:"2.85b publish_bid_documents.py + populate_contact_columns.py · 2.87 requirements · 2.89 bid packs",summary:["The registry lists no enrichment passes for Mississippi, and yet it is enriched. The document publisher is a global pass that sweeps every portal's snapshot file, so this portal is picked up whether it is listed or not (publish_bid_documents.py:175-176).","It takes the attachment links already sitting on each snapshot row, downloads the PDF, drops it into the shared document bucket and files a row against the bid's cluster. Then the text is pulled out of those documents and an agent extracts bonding, insurance, licensing and deadline requirements with a verbatim quote for each. Finally each clustered bid is rendered into a folder of readable markdown."],cells:[{label:"Real document record Bid B",paths:[],blocks:[`{
 "file_name": "Addendum 1-96866-072826 Residential
 Lots, Right-of-Way, and Vege.pdf",
 "file_url": "https://SRM.MAGIC.MS.GOV:443/SAP/EBP/
 DOCSERVER/7%2D20260720131419%20JACKSON.PDF?
 PHIOGET&KPID=02000600000A1FE1A1A1A42C130B1C52…",
 "file_description": ""
}`],notes:['Two things hide in that file name. The real solicitation number, 96866-072826, which the board card does not carry. And the fact that this is Addendum 1. The name is cut off at "Vege", and the original notice is not in the list at all.'],tables:[]},{label:"What is special about this portal here",paths:[],blocks:[],notes:['Mississippi is a good citizen here. Its attachments are real solicitation packets, not cover sheets, so its clusters usually have material worth extracting. A cluster with nothing to read still gets a neutral "no material" row so the board never shows a blank.'],tables:[[{header:!1,cells:["Documents come from the list row, captured at pull time","no detail-page visit is needed, which is why the shared document backstop skips this portal"]},{header:!1,cells:["The document server's security certificate is not in Python's trusted list","both the PDF fetcher and the publisher turn certificate checking off for srm.magic.ms.gov"]},{header:!1,cells:["Contacts are parsed back out of the description","the CONTACT: name · email line written at stage 2 is read back at populate_contact_columns.py:53-54"]},{header:!1,cells:["A bid that was never published has no cluster","its documents are skipped entirely (publish_bid_documents.py:199-201)"]},{header:!1,cells:["The synopsis cover sheet is left out of documents[] on purpose","it is auto-generated boilerplate; it is still fetched for scoring text at stage 5"]}]]}],notes:[],then:"one more dedup pass, then the mail and the health check"},{n:"12",title:"The closing steps",who:"2.875 dedup re-pass · 2.88 watch, digests, sentinel · 2.9 boards · 3/4 roll-up and scorecard",summary:["Dedup runs a second time after enrichment, because the buyer names and closing dates it needs to compare only get filled in at stage 11. This re-pass is a shared step across all portals; the Mississippi model document does not itemize it, so nothing portal-specific is claimed for it here.","Then the digests, the monitor boards and the terminal numbers."],cells:[{label:null,paths:[],blocks:[],notes:["Never add this portal's scoring.yes into a total. It is compile-time only and misses everything carry-forward brings back. Tonight it says 1; the day really ended with 4 YES on the board."],tables:[[{header:!0,cells:["Step","What it does for Mississippi"]},{header:!1,cells:["2.875 dedup re-pass","re-compares clusters now that buyers and dates are filled; shared step, not itemized in this portal's model"]},{header:!1,cells:["2.88 source watch",`off. The registry says watch: "none", so nothing re-captures this portal's pages to spot changes`]},{header:!1,cells:["2.88 discovery and watch emails, deadline alerts","written to markdown, but sending is a silent no-op until an email key exists in data/auth/resend.env"]},{header:!1,cells:["2.88 sentinel","checks every portal completed every phase and writes the health file"]},{header:!1,cells:["2.9 / 2.95 monitor and overview boards","turns the 42 daily folders into a tracking row: pulled, new, open, yes over time; labelled state MS"]},{header:!1,cells:["3 / 4 / 4.99 roll-up and scorecard","the scorecard queries the board database for the only YES number anyone should quote. A missing stats.json for today would mark this portal FAILED in the roll-up"]}]]}],notes:[],then:null}],l=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["The snapshot has no title field: 51 keys, none of them a title",'every board card reads "?" and every YES line in the report has a blank title. All 6 Mississippi cards, every run. The model calls this an aging edge case; it is not']},{header:!1,cells:["BidDescription is capped at 255 characters by the portal itself","Pass 1 reads a truncated description as the title; the real scope exists only inside the attachment PDFs, which are fetched for fresh OPENs only"]},{header:!1,cells:["BidNumber is a timestamp string, e.g. 7-20260720131419 Jackson","it becomes solicitation_no on the shared board, so this portal's number for a job will not match another portal's number for the same job. The real number sits inside the attachment file name"]},{header:!1,cells:["Nothing checks that runs/judge-verdicts.json is from today","on 28 July compile re-published a file last written on 24 July. stats.json scoring and today_new_judged both report scoring that did not happen. The board was unaffected. That bid was already live"]},{header:!1,cells:["Carry-forward probes new-bids.json, which holds only the new delta","_in_today_snapshot reads false on 26 of 26 carried rows, including bid 46030, which is plainly in the snapshot. Nothing is dropped; the flag is just meaningless here"]},{header:!1,cells:['keyword_passing and the report label "Passed LGS keyword gate (Pass 0)"',"describe a gate this pipeline deleted. The number is simply the new-bid count. Renaming it would break anything still reading the key"]},{header:!1,cells:["runs/keyword-passing.json is a 2-byte [] from 24 May 2026, still read by compile","a fallback that can never fill in, left by a one-off script that has not run since"]},{header:!1,cells:["run_daily.py:70-72 exits cleanly on a zero-new day and stops the sweep","would strand any never-scored OPEN. Prescribed for patching on 31 May 2026, still unpatched. It did not fire on 28 July: there were 50 new bids"]},{header:!1,cells:["runs/pdfs/ is never pruned","155 per-bid folders, 126 of them from 24 May 2026 and none newer than 24 July, mixing two generations of manifest with different shapes. No consumer is known to read them"]},{header:!1,cells:["The retired second-generation pipeline's output is still on disk","full-text-by-bid.json 2,840,294 bytes, judge-input-v2.json 1,784,292 bytes, keyword-passing-v2.json 108,573 bytes, plus v2 funnel and verdict files. Dropped 24 May 2026, kept for provenance"]},{header:!1,cells:["A stack of files in runs/ have no writer anywhere in the code","triage-input-all.json, a judge-batches/ folder of 16 hand-split files, two prompt payload dumps, two saved bid bodies and two session reports. All hand-made during a 24 May 2026 session"]},{header:!1,cells:["The document server's certificate is not in Python's trusted list","certificate checking is turned off for srm.magic.ms.gov in both the fetcher and the publisher"]},{header:!1,cells:["Some construction bids hide the packet behind a plan-room registration","the scorer flags them and we never auto-register. The endpoint also serves open bids only, so closed and awarded ones are invisible"]},{header:!1,cells:["data/ms-dfa/PORTAL.md is still an unaudited draft","auto-generated 14 July 2026 with TODO placeholders across the whole field map, and its health numbers (documents 50%, 2 bids surfaced) disagree with the 28 July field dump (documents 100%, 6 cards). No portal audit has been run"]},{header:!1,cells:["Two files disagree about the same day's funnel","stats.json says 19 open and 1 yes; portal-fields.json says triage_open: 0, judge_yes: 0 for the same date. They count different things. The second counts only tonight's new path, where both really are zero"]},{header:!1,cells:["The written model's volumes are out of date","docs/portal-dataflow/ms-dfa.md proves its arithmetic with 52 + 94 = 146 from 24 July. The 28 July run is 50 + 120 = 170. The stage shapes still hold; the counts do not"]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to data/ms-dfa/daily/2026-07-28/stats.json, runs/_funnel.json, a row count, a byte size or a file timestamp. Baseline map: docs/portal-dataflow/ms-dfa.md (evidence-cited to file:line), corrected on this page where the files disagreed with it."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to data/ms-dfa/daily/2026-07-28/stats.json, runs/_funnel.json, a row count, a byte size or a file timestamp. Baseline map: docs/portal-dataflow/ms-dfa.md (evidence-cited to file:line), corrected on this page where the files disagreed with it.",c="docs/portal-dataflow/pedia-ms-dfa.html",p={slug:e,title:t,eyebrow:s,headline:a,lede:n,funnel:i,funnel_note:r,legend:o,stages:d,sections:l,footer:h,source_page:c};export{p as default,s as eyebrow,h as footer,i as funnel,r as funnel_note,a as headline,n as lede,o as legend,l as sections,e as slug,c as source_page,d as stages,t as title};
