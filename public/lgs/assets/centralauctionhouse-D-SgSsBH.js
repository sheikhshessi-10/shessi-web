const e="centralauctionhouse",t="CentralAuctionHouse: what happens to a bid, stage by stage",a="Portal pedia · 12",s="CentralAuctionHouse: 255 open bids, and the one that got through was a no",n="Every stage of the run of 28 July 2026, with a real record from the actual files at each step. This was a quiet night. Of 255 open bids, 31 were new, 30 died on their title, and the single survivor came back from the judge as a NO at score 28. Nothing was scored YES or MAYBE. Every YES on the board that morning was an older one, kept alive by carry-forward.",o=[{value:"911",label:"buyer pages"},{value:"255",label:"open bids"},{value:"31",label:"new tonight"},{value:"30",label:"triage skip"},{value:"1",label:"triage says open"},{value:"0",label:"yes"},{value:"0",label:"maybe"},{value:"1",label:"no"}],r='Read from data/centralauctionhouse/daily/2026-07-28/stats.json (756 bytes): buyers_enumerated 911, total_open_bids 255, triage {open 1, skip 30, total 31}, scoring {yes 0, maybe 0, no 1}. "New tonight" is not a stats.json key: the 31 comes from the NEW column of daily/INDEX.md, the "NEW vs prior day" line of runs/INSIGHTS-2026-07-28.md, and the 31 rows in runs/triage-input-active-2026-07-28.json. All 911 buyer pages answered: buyers_err is an empty list in runs/raw-2026-07-28.json. The whole crawl took 54.3 seconds.',i=["Bid A · 14609604 · Grant Writing, Plaquemines Port Harbor & Terminal District, Louisiana. Dies at triage.","Bid B · 45530451 · 42201 C-10 Palm Harvest_2nd Call, St. Johns River Water Management District, Florida. The only bid the judge saw. Comes back NO, score 28.","Bid C · 8266222 · George County MS disaster debris. Not judged tonight. First judged 8 July, carried forward, still the top YES at 92."],l=[{n:"0",title:"The gate and the memory",who:"scripts/portal_due.py · the daily archive",summary:["Two things happen before any web page is opened. A gate asks whether this portal is due today, and the pipeline works out what it already knows.","This portal has no master file of every bid ever seen. There is no bids/all-bids.json here, and no database of its own. Its whole memory is one folder per run day. Tonight's diff compares against daily/2026-07-24/, because that is the newest folder that exists. The 25th, 26th and 27th have no folder at all.","When the gate says yes, the orchestrator hands the portal to a child agent, which runs the seven Python phases and the two AI passes by hand. There is no run_daily.py for this portal."],cells:[{label:"What it reads",paths:[{path:"data/portals/registry.json",size:"cadence_days: 1 · authed: true · carry_forward: orchestrator"},{path:"data/centralauctionhouse/daily/",size:"41 dated folders"}],blocks:[],notes:["The registry says run every day. data/centralauctionhouse/PORTAL.md:15 says every 3 days. The live value lives in Supabase, so neither file settles it. The four-day hole before tonight fits either answer."],tables:[]},{label:"The archive index row written at the end of the night",paths:[],blocks:[`| Date | Buyers | Open | NEW | OPEN | YES | YES core |
| 2026-07-23 | 911 | 237 | 19 | 1 | 0 | 0 |
| 2026-07-24 | 911 | 248 | 22 | 0 | 0 | 0 |
| 2026-07-28 | 911 | 255 | 31 | 1 | 0 | 0 |`],notes:["The last three rows of data/centralauctionhouse/daily/INDEX.md, with its Notes column (a link to each day's report) dropped for width. Three runs in a row with no YES."],tables:[]}],notes:[],then:"log in once, then walk every buyer page in five states"},{n:"1",title:"Pull the list",who:"data/centralauctionhouse/scripts/crawl.py",summary:[`A plain form login, then five state directory pages to collect every buyer link, then 911 buyer pages fetched 16 at a time. Every open row in each buyer's "Time Left" table becomes a bid. No browser is used. Login took 1.4 seconds, listing the buyers took 3.7 seconds, fetching them took 49.2 seconds.`,"Buyers by state: Louisiana 491, Mississippi 356, Florida 50, Arkansas 11, Alabama 3. Open bids by state: Louisiana 172, Mississippi 51, Florida 29, Alabama 2, Arkansas 1."],cells:[{label:"In → Out",paths:[{path:"data/auth/centralauctionhouse-TOW.json",size:"the throwaway login"},{path:"centralauctionhouse.com/rfpc{1,2,10548,10600,10694}-{State}.html",size:"5 directory pages"},{path:"runs/raw-2026-07-28.json",size:"954,316 bytes · 255 bids"}],blocks:[],notes:['One rule that keeps this honest. There is a tempting master endpoint, /List/CategoriesBids, that returns everything in one call. It is a curated "closing soon" subset and silently drops about 15% of open bids. The runbook forbids it. Walking 911 pages is the price of seeing everything.',"The backup crawler that did not run. There is a second pull script, crawl_browser_fallback.py, which drives the operator's own logged-in browser page by page and writes the same raw file, so nothing downstream can tell the difference. It takes about 22 minutes instead of 55 seconds, and the rule is to debug the fast crawl once before reaching for it. It wrote nothing on 28 July, and here is the proof it was not needed: buyers_err is an empty list and all 911 pages answered. A modeled stage with no file on disk, for a good reason."],tables:[]},{label:"Real record, the nine fields the crawl writes Bid A",paths:[],blocks:[`{
 "id": "14609604",
 "title": "Grant Writing, Grant Administration
 and Funding Strategies",
 "row_text": "Grant Writing, Grant Administration
 and Funding Strategies 07-Aug-2026
 2:00:00 PM CDT 9d, 22h+",
 "close_date_raw": "07-Aug-2026 2:00:00 PM CDT",
 "close_date_iso": "2026-08-07",
 "href": "https://www.centralauctionhouse.com/
 rfp14609604-grant-writing-grant-…",
 "buyer_id": "10861",
 "buyer_name": "Plaquemines Port Harbor &
 Terminal District",
 "state": "Louisiana"
}`],notes:["Read out of runs/raw-2026-07-28.json. The file on disk now holds four more fields per bid, because the next stage rewrites this same file in place."],tables:[]}],notes:[],then:"a second login, then one detail page per bid"},{n:"2",title:"Fetch every notice body",who:"data/centralauctionhouse/scripts/enrich_details.py",summary:["This portal fetches the full notice for every bid, before triage, not just for the ones triage keeps. All 255 detail pages, 16 at a time, in 14.5 seconds. The script opens its own fresh login, the second of the run.",'Result on the night: all 255 detail pages answered, 0 fetch errors, and 249 of them carried some notice text. Two different thin shapes hide inside that number. 40 of the 255 bodies are under 300 characters, 6 of them completely empty. Those are real notices that are simply terse: "See Attachments for Bid Documents", a bid date, an email address. Separately, 15 bodies came back as the same 523-character "Central Bidding - Error" page instead of the notice. That one is the permission wall, where the owner has not unlocked the listing yet. Both shapes are kept and counted, not treated as failures.'],cells:[{label:"In → Out (same file, rewritten)",paths:[{path:"runs/raw-2026-07-28.json",size:"255 bids in"},{path:"centralauctionhouse.com/rfp{id}-{slug}.html",size:"255 detail pages"},{path:"runs/raw-2026-07-28.json",size:"954,316 bytes · + description, description_chars, detail_meta, attachments"}],blocks:[],notes:["237 of the 255 bids came back carrying at least one attachment link. Those links are the only way documents are ever collected for this portal. Nothing later re-opens a detail page to look for them."],tables:[]},{label:"Real record, what stage 2 added Bid A",paths:[],blocks:[`{
 "description": "SECTION 1: SCOPE OF SERVICES
 SUMMARY, BACKGROUNDScope of Services
 Summary: The Port has determined it is
 in its best interests to request outside
 assistance for grant writing and
 administration…",
 "description_chars": 8000,
 "detail_meta": {
 "Creator Username": "PPHTD",
 "Bidding Privacy": "Bid encryption",
 "Started": "27-Jul-2026 12:00:00 AM CDT",
 "Ends": "07-Aug-2026 2:00:00 PM CDT ( 9d, 22h+ )",
 "History": "35 Views",
 "Event Status": "Event open for bids",
 "Visitors": "Visitors/Central Bidding Plan Holders"
 },
 "attachments": [{
 "text": "RFP- PSGP GRANT WRITER AND
 ADMINISTRATOR JULY 2026.pdf (281.9 KB)",
 "href": "https://www.centralauctionhouse.com/
 Attachment/e52c0b6f5d70851224d1724047e74988"
 }]
}`],notes:["description_chars is 8000 exactly, because the body is cut at 8,000 characters. The judge never sees more than that."],tables:[]}],notes:[],then:"compare tonight's ids against the last archived day"},{n:"3",title:"Diff against 24 July",who:"data/centralauctionhouse/scripts/diff_vs_prior.py",summary:["Tonight's 255 ids are compared with the 248 ids in daily/2026-07-24/new-bids.json. That gives 31 new, 24 gone and 5 changed. Only the 31 new ones cost any AI money. The other 224 are already decided.","A change here means a title or a close date moved. All 5 changes tonight were dates sliding later."],cells:[{label:"Out",paths:[{path:"daily/2026-07-28/changed.json",size:"1,483 bytes · 5 rows"},{path:"daily/2026-07-28/disappeared.json",size:"86,811 bytes · 24 rows"},{path:"runs/triage-input-active-2026-07-28.json",size:"10,404 bytes · 31 rows · 6 fields each"},{path:"runs/judge-input-active-2026-07-28.json",size:"93,802 bytes · 31 rows · full bodies"}],blocks:[],notes:["Two files for the same 31 bids. The thin one goes to the title reader. The fat one waits, holding the notice bodies, in case any bid survives."],tables:[]},{label:"Real record, one of the 5 changes",paths:[],blocks:[`{
 "id": "7465131",
 "from": {
 "title": "A26-0805 Mowing & Lawn Maintenance
 - EBR Police Evidence Facility",
 "close_date_iso": "2026-08-05"
 },
 "to": {
 "title": "A26-0805 Mowing & Lawn Maintenance
 - EBR Police Evidence Facility",
 "close_date_iso": "2026-08-20"
 }
}`],notes:["The buyer pushed the deadline out 15 days. Nothing downstream re-judges on a date change. This file is a record, not a trigger."],tables:[]}],notes:[],then:"31 titles go to the first AI pass"},{n:"4",title:"Pass 1: keep or drop, on the title",who:"max-triage · AI (the agent writes the file itself)",summary:["Thirty-one titles in, thirty-one answers out. Default is drop. 30 SKIP, 1 OPEN. The agent is allowed to be a little generous here, because on this portal Pass 2 already has the full notice body sitting in a file, so an extra look is cheap.","Tonight it was not generous. It let through exactly one bid, on the grounds that cutting palms down is vegetation work."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input-active-2026-07-28.json",size:"31 rows"},{path:"engine/orchestrator/agents/max-triage-persona.md",size:"the rules"},{path:"runs/triage-raw-2026-07-28.json",size:"3,521 bytes · 31 rows · 3 fields each"}],blocks:[`{
 "bidId": "45530451",
 "title": "42201 C-10 Palm Harvest_2nd Call",
 "state": "Florida",
 "buyer": "St. Johns River Water
 Management District",
 "close_date": "2026-08-05",
 "href": "https://www.centralauctionhouse.com/
 rfp45530451-42201-c-10-palm-harvest_2nd-call.html"
}`],notes:["This is where Bid A's journey ends. Pulled, detail-fetched, one title read. That is its whole cost."],tables:[]},{label:"Real records Bid A, droppedBid B, kept",paths:[],blocks:[`{
 "bidId": "14609604",
 "decision": "SKIP",
 "reason": "Grant writing = professional
 admin services"
}`,`{
 "bidId": "45530451",
 "decision": "OPEN",
 "reason": "Palm harvest = vegetation removal
 on district land"
}`],notes:["Both read verbatim from runs/triage-raw-2026-07-28.json. The other 29 SKIPs sit in the same file."],tables:[]}],notes:[],then:"the one survivor is packed with the body already on disk"},{n:"5",title:"Build the judge's packet",who:"data/centralauctionhouse/scripts/prep_judge_input.py",summary:["No network calls. The script takes the bids Pass 1 kept, finds their already-fetched notice body, header pairs and attachment list from stage 3's fat file, and writes one packet. One bid tonight, 1,743 bytes.","If an OPEN bid somehow has no body, the script stops hard and names the bid, so nobody ever judges an empty page by accident. If Pass 1 kept nothing at all, it writes an empty list and Pass 2 simply does not run. That is what happened on 24 July."],cells:[{label:"In → Out",paths:[{path:"runs/triage-raw-2026-07-28.json",size:"the 1 OPEN"},{path:"runs/judge-input-active-2026-07-28.json",size:"the bodies"},{path:"runs/judge-input-open-2026-07-28.json",size:"1,743 bytes · 1 row"}],blocks:[],notes:["A link gets rewritten here. The crawl captured the real page address, rfp45530451-42201-c-10-palm-harvest_2nd-call.html. This script throws the slug away and builds rfp45530451-x.html instead (prep_judge_input.py:213). The judge and anyone reading the packet get the stub form of the link, not the one the site listed."],tables:[]},{label:"Real record Bid B",paths:[],blocks:[`{
 "bidId": "45530451",
 "title": "42201 C-10 Palm Harvest_2nd Call",
 "state": "Florida",
 "buyer": "St. Johns River Water
 Management District",
 "close_date": "2026-08-05",
 "bidUrl": "https://www.centralauctionhouse.com/
 rfp45530451-x.html",
 "description": "The St. Johns River Water Management
 District (the “District”) is seeking submittals
 from qualified Respondents with a minimum of
 three (3) years of experience harvesting cabbage
 palms. The selected Respondent shall harvest
 cabbage (also called Sabal) palms within
 designated areas, remove and transport harvested
 palms away from District property and purchase
 all harvested palms from the District a…",
 "description_chars": 752,
 "detail_meta": {
 "Event Status": "Event open for bids",
 "Ends": "05-Aug-2026 2:00:00 PM EDT ( 7d, 21h+ )",
 "History": "6 Views"
 },
 "attachments": [{
 "text": "42201IFB26 C-10 Palm Harvest_2nd
 Call.pdf (1.0 MB)",
 "href": "https://www.centralauctionhouse.com/
 Attachment/4d7d09e6038b5199d0e0851f0c215671"
 }],
 "triage_reason": "Palm harvest = vegetation removal
 on district land"
}`],notes:["Four of the seven detail_meta pairs are left out above for width. The 752-character body is real notice text, not a wall."],tables:[]}],notes:[],then:"one bid, one score"},{n:"6",title:"Pass 2: the judge says no",who:"max-bid-judge · AI (the agent writes the file itself)",summary:["The body flipped the read. This is not a job where LGS gets paid to clear vegetation. The winner has to buy the harvested palms from the District and sell them on into the nursery trade, and must show three years of cabbage-palm harvesting experience. Money runs the wrong way and the qualification is one LGS cannot show.",'Score 28. kansas_city_risk is set to true, which is the flag for "we could win this and then be unable to deliver it". That is the whole scoring output for the night: 0 yes, 0 maybe, 1 no.'],cells:[{label:"In → Out",paths:[{path:"runs/judge-input-open-2026-07-28.json",size:"1 row"},{path:"engine/orchestrator/agents/max-persona.md",size:"the win history and the rules"},{path:"runs/judge-verdicts-raw-2026-07-28.json",size:"3,177 bytes · 1 row"}],blocks:[],notes:["This is a good no. Pass 1 was right to open it on the title, and Pass 2 was right to close it on the body. The judge even leaves a note for the operator: if the District ever re-lets this as a paid clearing contract instead of a sale, that one is worth a look. That is the two-pass design doing exactly what it is for."],tables:[]},{label:"Real record Bid B: NO, 28",paths:[],blocks:[`{
 "bidId": "45530451",
 "title": "42201 C-10 Palm Harvest_2nd Call",
 "buyer": "St. Johns River Water
 Management District",
 "state": "Florida",
 "would_lgs_bid": "no",
 "score": 28,
 "category": "non-fit — vegetation sale /
 commercial palm salvage",
 "primary_reason": "This is not a vegetation-removal
 service contract, it is a timber-style sale — the
 winning respondent must PURCHASE all harvested
 cabbage palms from the District at the bid rate
 and haul them off. LGS gets paid to remove
 vegetation; here the money runs the other way…",
 "service_match": "adjacent",
 "scale_match": "unknown",
 "buyer_match": "core",
 "red_flags": [
 "inverted_revenue_contractor_pays_district",
 "requires_palm_resale_channel_not_lgs_business",
 "specialty_prequal_3yr_cabbage_palm_harvest_experience",
 "no_stated_contract_value_vendor_bids_a_purchase_rate",
 "no_guarantee_of_marketable_palm_quantity_or_quality",
 "second_call_resolicitation_prior_attempt_failed",
 "out_of_core_state"
 ],
 "fit_signals": [
 "tree_removal_and_haul_off_field_work",
 "water_management_district_buyer_type_seen_before",
 "multi_year_term_2yr_plus_three_12mo_renewals"
 ],
 "kansas_city_risk": true,
 "closed_award": false
}`],notes:["The elaboration field, 1,406 more characters of reasoning, is left out for width. Everything shown is verbatim."],tables:[]}],notes:[],then:"join the three files into one report"},{n:"7",title:"The night's own report",who:"data/centralauctionhouse/scripts/compile_insights.py",summary:["The snapshot, the Pass 1 decisions and the Pass 2 verdict are joined into one table, then written out as a funnel report and an action list of everything worth an operator's time.","The action list tonight is 107 bytes. That is the header row and nothing under it, because the action list only carries YES and MAYBE, and there were none."],cells:[{label:"Out",paths:[{path:"runs/INSIGHTS-2026-07-28.md",size:"1,096 bytes"},{path:"runs/INSIGHTS-2026-07-28-action.csv",size:"107 bytes · header only"}],blocks:[`Verdict,Score,Title,State,Buyer,Days to close,
Close date,Category,Reason,Red flags,
Fit signals,Bid URL`],notes:["The whole file, verbatim. Twelve column names and no rows."],tables:[]},{label:"Real lines from INSIGHTS-2026-07-28.md",paths:[],blocks:[`| Stage | Count |
| Buyers enumerated (5 state dirs) | 911 |
| Buyer pages fetched OK | 911 |
| Truly-open bids today (all states) | 255 |
| NEW vs prior day | 31 |
| Pass 1 — max-triage OPEN | 1 |
| Pass 1 — SKIP | 30 |
| Pass 2 — YES | **0** |
| Pass 2 — MAYBE | 0 |
| Pass 2 — NO | 1 |

**Bottom line:** 0 YES bids today, 0 closing
in 7d or less.`],notes:[],tables:[]}],notes:[],then:"the working files become the permanent record"},{n:"8",title:"Promote into the archive",who:"data/centralauctionhouse/scripts/migrate_to_daily.py",summary:["Tonight's working files are copied into data/centralauctionhouse/daily/2026-07-28/ under standard names, the counts file is written, and a row is added to the archive index. This folder is the portal's only durable memory, so what is not copied here is effectively forgotten."],cells:[{label:"The archive · data/centralauctionhouse/daily/2026-07-28/",paths:[],blocks:[],notes:[],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","255 rows: every open bid, not the 31 new ones","937,273 B"]},{header:!1,cells:["triage.json","31 Pass 1 decisions, tomorrow's memory","3,521 B"]},{header:!1,cells:["verdicts.json","1 row at this moment, 19 after stage 9","36,057 B"]},{header:!1,cells:["changed.json","5 date moves","1,483 B"]},{header:!1,cells:["disappeared.json","24 bids gone since 24 July","86,811 B"]},{header:!1,cells:["stats.json","the funnel counts","756 B"]},{header:!1,cells:["report.md","rewritten later at stage 10","5,964 B"]}]]},{label:"The whole of stats.json, the numbers everything downstream trusts",paths:[],blocks:[`{
 "date": "2026-07-28",
 "source": "centralauctionhouse",
 "scan_method": "python:requests-parallel",
 "states": ["Louisiana", "Mississippi", "Arkansas",
 "Alabama", "Florida"],
 "buyers_enumerated": 911,
 "buyers_ok": 911,
 "total_open_bids": 255,
 "per_state_open_counts": {
 "Louisiana": 172, "Mississippi": 51,
 "Arkansas": 1, "Alabama": 2, "Florida": 29
 },
 "triage": {"open": 1, "skip": 30, "total": 31},
 "scoring": {"yes": 0, "maybe": 0, "no": 1, "total": 1},
 "verdicts_unresolved": 0,
 "fetch_seconds": 49.21408176422119,
 "total_seconds": 54.31438446044922,
 "generated_at_utc": "2026-07-28T20:28:13.405796+00:00"
}`],notes:["Two gaps in this file bite later. There is no carryover_count and no new_to_triage key. The shared report writer at stage 10 looks for both by name, and prints a question mark when it cannot find them. Also, fetch_seconds is only the buyer-page time. The 14.5 seconds of detail fetching is not counted anywhere in this file."],tables:[]}],notes:[],then:"the portal's own work is done, the shared machinery takes over"},{n:"9",title:"Carry forward: ON for this portal",who:"2.5 · scripts/carry_forward_verdicts.py",summary:['The registry entry says carry_forward: "orchestrator". In plain words: yes, this portal is in the nightly carry-forward sweep, and the shared script owns it. Portals marked engine-internal or none are left out, because their own code already handles it or they do not need it. This one needs it badly, since its only memory is a folder of files.',"Tonight's single verdict is merged with the 18 still-valid verdicts from 24 July. A verdict is dropped only if the bid was re-judged today, is marked as an awarded contract, or was first judged more than 90 days ago. None were dropped.","This is why the board did not go blank. Without this step the portal would have shown one NO and nothing else."],cells:[{label:"The whole audit file, verbatim",paths:[],blocks:[`{
 "portal": "centralauctionhouse",
 "ok": true,
 "skipped": false,
 "today": "2026-07-28",
 "prior_date_used": "2026-07-24",
 "today_new_judged": 1,
 "carried_forward": 18,
 "carried_forward_not_in_today_snapshot": 12,
 "dropped_too_old": 0,
 "dropped_already_judged_today": 0,
 "dropped_closed_award": 0,
 "final_total": 19,
 "final_yes": 10,
 "final_maybe": 4,
 "final_no": 5,
 "max_age_days": 90
}`],notes:["Look at carried_forward_not_in_today_snapshot: 12. Two thirds of the kept verdicts belong to bids that were not in tonight's crawl at all. They are kept anyway and stamped _in_today_snapshot: false. The shared runbook still claims this step only keeps verdicts whose bid is still in the snapshot. The code has not worked that way since 31 May. The code is right, the runbook text is stale."],tables:[]},{label:"Real record Bid C: the top YES, and it is old",paths:[],blocks:[`{
 "bidId": "8266222",
 "title": "GEORGE COUNTY RFP #DDR-2026-01
 DISASTER DEBRIS REMOVAL AND DISPOSAL",
 "buyer": "George County",
 "state": "Mississippi",
 "would_lgs_bid": "yes",
 "score": 92,
 "category": "Category 1 — Disaster/Storm
 Debris Removal",
 "red_flags": [
 "thin_description_pull_rfp_packet",
 "description_is_portal_error_not_content"
 ],
 "_first_judged": "2026-07-08",
 "_carryforward_from": "2026-07-24",
 "_in_today_snapshot": true,
 "verdict": "yes"
}`,`10 yes · 4 maybe · 5 no
 1 judged tonight (the NO)
18 carried from 2026-07-24
12 of those not in tonight's crawl
 oldest first judged 2026-06-08`],notes:["Twenty days old, still the best thing this portal has. Its own red flags say the page it was scored from was a portal error message, not the notice. It was scored on the title alone."],tables:[]}],notes:[],then:"ledger, report rewrite, and the board fixture"},{n:"10",title:"Ledger, rewritten report, board cards",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared scripts read the archive. The first adds this portal's verdicts to the cross-portal running YES ledger. The second throws away the report from stage 7 and writes a new one in the shared house layout. The third walks every day of the archive, keeps the YES verdicts, and writes the file the board publisher reads.","MAYBE never reaches the board from this portal. Only federal feeds pass MAYBE through; everyone else passes YES only. So the 4 MAYBEs stop here."],cells:[{label:"Out",paths:[{path:"data/portals/cumulative-yes.json + .md",size:"cross-portal ledger"},{path:"daily/2026-07-28/report.md",size:"5,964 B · overwritten 22:37 UTC"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"1,470 cards total · 24 from this portal"}],blocks:[],notes:["Why the contact is always empty. The card builder tries to overlay richer fields from data/centralauctionhouse/bids/all-bids.json. That file does not exist, and neither does the bids/ folder. The overlay is a dead branch, so contact name, email and phone publish as null every night. This is the code-level reason the runbook records 9% contact coverage.","All 24 cards are YES. All 24 say has_documents: true, which means the card's cluster has at least one document row in the shared table, not that a Central Bidding file was downloaded. Zero of the 24 carry a contact email."],tables:[]},{label:"Real lines from the rewritten report.md",paths:[],blocks:[`# centralauctionhouse — 2026-07-28

**Source:** · engine \`\` · state Louisiana

- Snapshot: **255** open bids
- Carryover: ? · NEW today: ?
- Triage: 1 OPEN / 30 SKIP
- Scored: **10 YES / 4 MAYBE / 5 NO**

## YES — Max would bid

- **[92] GEORGE COUNTY RFP #DDR-2026-01…**
 — George County · closes unknown
- **[92] Bid File No. 26-300-014 … DeSoto County
 Disaster Debris Removal Assistance…**
 — Desoto County Board of Supervisors · closes unknown`],notes:['Three visible defects in one header. The two question marks are real output: the report writer looks for carryover_count and new_to_triage in stats.json and this portal writes neither, so the two most useful numbers of the night print as ?. Every YES says "closes unknown", because a verdict row carries no close date and nothing joins it back to the snapshot. And the header calls a five-state portal "state Louisiana" with an empty engine name. The report says 10 YES on a night that produced none, which is true but reads as if tonight found them.'],tables:[]}],notes:[],then:"bids stop being portal-shaped here"},{n:"11",title:"Onto the shared board, and clustered",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["The 24 cards are pushed into the shared bids table, each gets a cluster id, and the cluster is compared against every other portal's bids. If the same George County debris RFP also came in through BidNet or NAPC, the three copies become one row for the operator.","Two things make this portal easy to cluster. Its bid id is Central Bidding's own numeric id, which never changes, so a dedup decision made once stays keyed correctly. And it is not treated as an aggregator, so when a cluster picks which buyer name to show, this portal's buyer name wins over an aggregator's."],cells:[{label:"In → Out",paths:[{path:"PortalPro/src/fixtures/portal-bids.json",size:"24 cards"},{path:"daily/2026-07-28/stats.json",size:"becomes the sweep_runs row"},{path:"supabase.portals · bids · sweep_runs · clusters",size:null}],blocks:[],notes:["The board is not tonight, it is everything. Tonight's verdicts file holds 10 YES. The board carries 24 cards for this portal, because the card builder walks all 41 archive days, not just today. So a quiet night changes nothing on screen. The flip side is the known trap on this path: a bid that drops out of the fixture can have its live board row swept away as stale."],tables:[]},{label:"Real card Bid C on the board",paths:[],blocks:[`{
 "id": "c1882d929ac4189f",
 "portal": "centralauctionhouse",
 "source_bid_id": "8266222",
 "title": "GEORGE COUNTY RFP #DDR-2026-01
 DISASTER DEBRIS REMOVAL AND DISPOSAL",
 "buyer": "George County",
 "state": "MS",
 "solicitation_no": null,
 "federal": false,
 "score": 92,
 "verdict": "yes",
 "due_date": "2026-08-07",
 "source_url": "https://www.centralauctionhouse.com/
 rfp8266222-george-county-rfp-ddr-2026-01-…",
 "contact_name": null,
 "contact_email": null,
 "contact_phone": null,
 "first_seen": "2026-07-08",
 "last_seen": "2026-07-28",
 "has_documents": true
}`],notes:["Note source_url here is the real slug link from the crawl, not the -x.html stub the judge packet used. Two files, two spellings of the same address."],tables:[]}],notes:[],then:"now try to get the actual documents"},{n:"12",title:"Documents, and the paywall in front of them",who:"2.85 enrichment · data/centralauctionhouse/scripts/publish_docs.py · then 2.87 requirements",summary:['The registry lists exactly one enrichment pass for this portal, "centralauctionhouse docs". It logs in again and replays the attachment links the pull already captured. It never opens a detail page, so it can only ever fetch links stage 2 saw.',"Each link is probed first. The site answers with a number: ATTACH_UNLOCKED 0, 1 or 2. Zero means the account has no paid subscription with that agency, and the file is skipped and never uploaded. That is the wall. This pass only adds; it never touches bids, verdicts or clusters.","Then requirements extraction runs, and it runs per cluster, not per portal. When a Central Bidding attachment is locked, the cluster often has to live on another portal's copy of the same documents. A cluster with no material at all still gets a neutral row, so the board never shows a blank."],cells:[{label:"The gate, in order",paths:[],blocks:[],notes:["An unresolved disagreement. The runbook records 96% document coverage for this portal. The enrichment recipe's own note says 14%. Both are dated snapshots from different measurements and neither was re-derived here. Do not quote either number as current."],tables:[[{header:!1,cells:["Read attachment links from daily/*/new-bids.json","237 of tonight's 255 bids carry at least one"]},{header:!1,cells:["Probe /Attachment/{hash}?ajax_request=true","answer is ATTACH_UNLOCKED 0, 1 or 2"]},{header:!1,cells:["0 = no subscription for that agency","skipped, never uploaded"]},{header:!1,cells:["Bid has no cluster id yet","skipped"]},{header:!1,cells:["Session expired, an HTML login page comes back","rejected by the file-shape check, not saved as a PDF"]},{header:!1,cells:["Otherwise","upload to the shared bucket + one bid_documents row"]}]]},{label:"A real attachment link, as captured Bid B",paths:[],blocks:[`{
 "text": "42201IFB26 C-10 Palm
 Harvest_2nd Call.pdf (1.0 MB)",
 "href": "https://www.centralauctionhouse.com/
 Attachment/4d7d09e6038b5199d0e0851f0c215671"
}`],notes:[`A stale flag costs a slot every night. The enrichment registry marks this pass "heavy", which reserves one of the limited browser lanes. The script uses no browser at all, only plain web requests, and the portal's own watch recipe declares itself light. Nobody has confirmed the heavy flag is deliberate.`,"The file name and its size are public. Whether the bytes come down depends on the answer to the probe. Bid B was judged NO, so its cluster is not on the board and this link is never replayed."],tables:[]}],notes:[],then:"second dedup pass, then watching for changes"},{n:"13",title:"The rest of the night",who:"2.875 dedup re-pass · 2.88 watch, page text, digests · 3 / 4 / 4.99 roll-up, scorecard, sentinel",summary:["Dedup runs a second time, on pairs that only became comparable once enrichment filled in a buyer, a due date or a solicitation number. If there are no candidate pairs, no judge is called at all.","Then the watcher re-fetches the pages of bids the team is actively working and diffs them against last time. This portal's watch recipe is the cheapest in the fleet: plain web requests, no browser. Any sign of a bot challenge in the page and the whole portal aborts rather than push."],cells:[{label:null,paths:[],blocks:[],notes:["What tonight sent downstream. One new NO, no new YES, and 18 rescued older verdicts. The operator's board looked unchanged, and that was the correct outcome, not a failure. The one thing worth an operator's attention is stage 10's report header, which prints 10 YES with two question marks where the night's real numbers should be."],tables:[[{header:!0,cells:["Step","What it does for this portal"]},{header:!1,cells:["Watch v2 re-capture","writes page text and link lists to data/portals/v2/pages/centralauctionhouse/. Capture is shadow only. The promoted list is empty, so nothing from it is written back to the bids table."]},{header:!1,cells:["Watch v2 diff","this part is real: it writes bid_updates and bid_watch_state rows for new documents, page changes and failed fetches"]},{header:!1,cells:["Free list-signal watcher","near useless here. Central Bidding's list rows carry no addendum counter, so almost all change signal comes from the re-capture"]},{header:!1,cells:["Page text store","whatever text was captured is pushed to bid_page_text, which feeds requirements and future diffs"]},{header:!1,cells:["Email digests","the markdown files are written, but sending is a silent no-op until an email key is set in data/auth/resend.env"]},{header:!1,cells:["Bid packs","each keyed cluster holding a Central Bidding bid gets a page-centralauctionhouse.md in its pack folder"]},{header:!1,cells:["Roll-up and scorecard","the roll-up reads this portal's stats.json and verdicts.json for one row. Never add up scoring.yes across portals; the scorecard is the only YES number"]},{header:!1,cells:["Sentinel","checks every phase actually ran. The runbook recorded this portal as sweep_stale on 14 July"]}]]}],notes:[],then:null}],d=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["new-bids.json holds every open bid, not the new ones. Tonight: 255 rows, 31 actually new",'anyone counting rows in that file to get "new bids" is off by eight times. The archive index admits it in words: "every truly-open bid today"']},{header:!1,cells:["There is no bids/all-bids.json, and no bids/ folder at all","the card builder's overlay is a dead branch, so contact name, email and phone publish as null forever. 0 of 24 live cards have a contact"]},{header:!1,cells:["stats.json has no carryover_count and no new_to_triage",'the shared daily report prints "Carryover: ? · NEW today: ?" every single night']},{header:!1,cells:["Verdict rows carry no close date",'every YES in the report reads "closes unknown", even though the snapshot next to it has the date']},{header:!1,cells:['Report header says "state Louisiana" and "engine ``"',"a five-state portal is labelled as one state, and the engine name is blank because the registry has no engine for it"]},{header:!1,cells:["Attachments sit behind a per-agency entitlement gate (ATTACH_UNLOCKED 0)","the file name and size are visible, the bytes are not. Many clusters reach requirements extraction with no material of their own"]},{header:!1,cells:["The judge packet rewrites the bid link to rfp{id}-x.html","the real slug link the crawl captured is dropped at prep_judge_input.py:213. Two files, two spellings of one address"]},{header:!1,cells:['Detail bodies are cut at 8,000 characters. 40 of 255 came back under 300, six of them empty; separately 15 came back as one 523-character "Central Bidding - Error" page',"the two look alike in a row count but are not the same thing. The short ones are real, just terse. The 523-byte ones are the permission wall, and the judge flags those description_is_portal_error_not_content and scores on the title instead"]},{header:!1,cells:["The tempting /List/CategoriesBids endpoint",'a curated "closing soon" subset that silently drops about 15% of open bids. Banned by the runbook. Walking 911 buyer pages is the price of completeness']},{header:!1,cells:["Five states only: AL, AR, FL, LA, MS","three of LGS's eight core states, Georgia, Tennessee and Texas, are simply not on this portal"]},{header:!1,cells:["Cadence is unsettled: registry says 1 day, the runbook says 3","the live value lives in Supabase, so no file in the repo settles it. The four-day gap before tonight fits either"]},{header:!1,cells:['The docs pass is flagged "heavy" but uses no browser',"it reserves a browser lane every night for a script that only makes plain web requests. Looks like a stale flag, not verified as intentional"]},{header:!1,cells:["The runbook at data/centralauctionhouse/PORTAL.md is still the auto-generated draft","field map, pull selectors, documents and watch signals are all marked TODO. The scripts are the only real description of how this portal is driven"]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk. Every count traces to daily/2026-07-28/stats.json, a row count, a byte size, or a line of the file itself. No record on this page was written by hand. Baseline map: docs/portal-dataflow/centralauctionhouse.md, evidence-cited to file:line; where that map and the files disagreed, the files won and the page says so. Companion pages: Portal pedia · 01 (BidNet), · 02 (DemandStar)."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk. Every count traces to daily/2026-07-28/stats.json, a row count, a byte size, or a line of the file itself. No record on this page was written by hand. Baseline map: docs/portal-dataflow/centralauctionhouse.md, evidence-cited to file:line; where that map and the files disagreed, the files won and the page says so. Companion pages: Portal pedia · 01 (BidNet), · 02 (DemandStar).",c="docs/portal-dataflow/pedia-centralauctionhouse.html",u={slug:e,title:t,eyebrow:a,headline:s,lede:n,funnel:o,funnel_note:r,legend:i,stages:l,sections:d,footer:h,source_page:c};export{u as default,a as eyebrow,h as footer,o as funnel,r as funnel_note,s as headline,n as lede,i as legend,d as sections,e as slug,c as source_page,l as stages,t as title};
