const e="va-eva",t="eVA Virginia: what happens to a bid, stage by stage",a="Portal pedia · 48",s="eVA Virginia: what happens to a bid, from a locked-down search box to the board",n="Every stage of the nightly run, with a real record from the actual files at each step. Two bids are followed the whole way. One sits forever in the discard pile, one reaches the board as a YES at score 88. All data is from the run of 28 July 2026, the newest archive this portal has.",o=[{value:"517",label:"in snapshot"},{value:"432",label:"carried over"},{value:"85",label:"new tonight"},{value:"37",label:"triage says open"},{value:"8",label:"yes"},{value:"8",label:"maybe"},{value:"21",label:"no"}],r="Every number above is from data/va-eva/daily/2026-07-28/stats.json (472 bytes). The snapshot count matches data/va-eva/bids/all-bids.json (517 rows, 642,840 bytes). Read the 8 YES carefully. The AI judge only looked at 7 bids that night and only one of them came back YES. The other 7 YES rows are older judgments from 15, 20, 21, 23 and 24 July that this portal copies forward into every new day's file. Same for the MAYBEs and the NOs: 7 of the 37 verdict rows were written on 28 July, 30 were written earlier. verdicts_unresolved: 0, so nothing was left hanging.",i=["Bid A · 119419 · EV charger grant programme, Virginia Department of Energy. Thrown out on an earlier night, stays thrown out.","Bid B · 124749 · vegetative maintenance of rights-of-way, City of Virginia Beach. YES at 88, first judged 21 July.","Both are carryover bids, like 432 of the 517 that night. Neither was triaged or judged on 28 July, so neither appears in this run's triage or judge files. Where they are missing, the page says so."],l=[{n:"0",title:"Is eVA due tonight?",who:"scripts/portal_due.py --batch portals",summary:["The gate looks at the newest dated folder under data/va-eva/daily/. This portal runs every day, so it is almost always due. If there is no daily folder at all it is treated as due.","Missing a day costs nothing. The sweep compares against its own archive, not against yesterday, so a four-day gap just means a bigger pile of new bids."],cells:[{label:"In",paths:[{path:"data/portals/registry.json",size:"cadence_days: 1"},{path:"data/va-eva/daily/*/",size:"36 dated folders on disk"}],blocks:[],notes:[],tables:[]},{label:"Out · the registry row that drives everything downstream",paths:[],blocks:[`{
 "slug": "va-eva",
 "label": "eVA Virginia",
 "engine": "eva",
 "batch": "portals",
 "cadence_days": 1,
 "authed": false,
 "enrich_passes": ["eva (recaptcha)"],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:["Four of these fields decide later stages: carry_forward at stage 8, watch at stage 13, enrich_passes at stage 11, in_portalpro at stage 9."],tables:[]}],notes:[],then:"a real browser is opened, because plain web requests get rejected"},{n:"1",title:"Pull the whole open list",who:"data/va-eva/scripts/run_daily.py (step 1: ps.pull)",summary:["Virginia puts every open solicitation behind one search box. That search box only answers a browser, and only if you ask it the one exact question it likes. So the run opens the public list page in a headless browser to pick up a session, then loops a search call from inside that page until the cursor stops moving.","The good news is that each result already carries its full scope text. Unlike most portals, eVA hands over the description in the same breath as the title. No second visit is needed to know what a bid is about.","The whole pull took 11 seconds: started 21:06:35 UTC, finished 21:06:46 UTC, 517 rows written."],cells:[{label:"In → Out",paths:[{path:"mvendor.cgieva.com/Vendor/public/AllOpportunities.jsp",size:"gets the session"},{path:"mvendor.cgieva.com/Vendor/public/solrconnect.jsp",size:"the search call, 15 rows at a time"},{path:"data/va-eva/bids/all-bids.json",size:"642,840 bytes · 517 rows · 15 fields"},{path:"data/va-eva/bids/index.json",size:"230 bytes"},{path:"data/va-eva/logs/pull_log.txt",size:"9,240 bytes"}],blocks:[`[2026-07-28T21:06:35.838226+00:00] eVA pull ·
 Solr via Playwright in-page fetch
[2026-07-28T21:06:46.862288+00:00] wrote 517 open
 solicitations -> …\\data\\va-eva\\bids\\all-bids.json`],notes:[],tables:[]},{label:"Real record Bid A",paths:[],blocks:[`{
 "bid_id": "119419",
 "title": "Projects awarded under EVCAP will fund
 the purchase and installation of EV
 chargers to support EV adoption in
 underserved communities, with a focus on
 addressing gaps in EV charging access…",
 "buyer": "Virginia Department of Energy",
 "state": "VA",
 "due_date": "2026-06-30",
 "due_date_raw": "2026-06-30T00:00:00Z",
 "category": "Sole Source (SS)",
 "location": "TBD",
 "solicitation_no": "Electric Vehicle Charging
 Assistance Program (EVCAP) Round 2",
 "status": "Open",
 "detail_url": "https://mvendor.cgieva.com/Vendor/
 public/IVDetails.jsp?PageTitle=SO%20Details
 &rfp_id_lot=119419&rfp_id_round=0",
 "description": "Projects awarded under EVCAP will
 fund the purchase and installation of EV…",
 "contact_name": "Jennifer Dillemuth",
 "buyername": "Jennifer Dillemuth",
 "_detail_ok": true
}`],notes:["Look at title. It is not a title, it is the opening of the scope paragraph. The short human name sits in solicitation_no. Across the 517 rows the middle title is 251 characters long and 303 of them are byte-for-byte identical to the description field."],tables:[]}],notes:["Two things to know about this stage. The search box only accepts one exact query shape. Change the sort, the row cap or the status filter and it hands back nothing. And this engine has no floor guard: if the loop comes back with zero results after a block or a throttle, the empty list is written over the healthy 517-row file anyway. Five sibling engines refuse to let that happen — two keep the old file behind an explicit floor guard (govconapi.py, prorfx.py) and three crash before they write a zero (bidexpress.py, ionwave.py, sc_sceis.py). This one does neither. The next morning every bid would look brand new."],then:"tonight's list is compared against the last archive"},{n:"2",title:"Split into old news and new news",who:"data/va-eva/scripts/run_daily.py (step 2: ps.prep)",summary:["The 517 rows are matched against the newest earlier archive, which was 24 July with 507 bids in it. Anything seen before keeps its old decision and goes in the carryover pile. Anything never seen goes in the queue for the AI.","That night: 432 carryover, 85 new. The funnel file records that 507 earlier ids were compared against and 432 of them matched. The gap between those two numbers is not written down anywhere, so this page does not put a name on it."],cells:[{label:"In → Out",paths:[{path:"data/va-eva/bids/all-bids.json",size:"517 rows"},{path:"data/va-eva/daily/2026-07-24/triage.json",size:"507 known ids"},{path:"runs/triage-input.json",size:"33,475 bytes · 85 rows · the new ones only"},{path:"runs/triage-carryover.json",size:"51,188 bytes · 432 rows"},{path:"runs/judge-input.json",size:"703,244 bytes · 517 rows"},{path:"runs/_funnel.json",size:"156 bytes"}],blocks:[],notes:["The 703 KB file nobody reads tonight. judge-input.json is rebuilt for all 517 bids every single run, then the very next stage narrows the judging set down to 7. That is 703,244 bytes written to feed a 7,586-byte file."],tables:[]},{label:"The counts this stage wrote · runs/_funnel.json",paths:[],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 517,
 "carryover_count": 432,
 "triage_input_count": 85,
 "prior_archive_ids_compared_against": 507
}`,`{
 "bid_id": "119419",
 "decision": "SKIP",
 "reason": "non-fit (commodity/construction/
 A&E/admin)"
}`],notes:['Bid A costs nothing tonight. It was judged unfit on an earlier night and that answer is simply copied across. Bid B rides the same path with "decision": "OPEN".'],tables:[]}],notes:['One quiet oddity in the snapshot. Bid A closed on 30 June. The run date is 28 July. Virginia still lists it as "status": "Open" and so it still occupies a row. It is the only one of the 517 whose close date is already in the past, so this is rare, not routine, but nothing in the pipeline drops it.'],then:"the 85 new titles go to the AI, no keyword filter in front"},{n:"3",title:"Pass 1: keep or drop",who:"max-triage · AI (fallback general-purpose)",summary:["An agent reads the 85 new bids and marks each one OPEN or SKIP. The default answer is SKIP. It only says OPEN when it sees real LGS work words: tree, debris, vegetation, right-of-way, clearing, mowing, brush, stump, storm, line clearance, creek, channel, ditch. Or when a utility buyer posts a title too cryptic to rule out.","That night: 78 SKIP, 7 OPEN. Every new bid is read by the AI. There is no keyword gate in front of it."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"33,475 bytes · 85 rows · 6 fields each"},{path:"runs/triage-verdicts.json",size:"8,364 bytes · 85 rows"}],blocks:[`{
 "idx": 363,
 "bid_id": "125204",
 "title": "To provide the necessary equipment,
 personnel, supervision, and materials to
 perform general plant bed maintenance, tree
 pruning, and mulching of plant beds and tree
 rings within the VDOT right-of-way along
 select routes. All sites are located within
 the counties of Arlington, Fairfax, Fauquier, L",
 "buyer": "Virginia Department of Transportation",
 "state": "VA",
 "due_date": "2026-08-21"
}`],notes:['The title is cut off mid-word at "Fauquier, L". That is the 300-character cap on this field, not a typo.'],tables:[]},{label:"Real records out droppedkept",paths:[],blocks:[`{
 "idx": 18,
 "bid_id": "125095",
 "decision": "SKIP",
 "reason": "Rock asphalt commodity delivery"
}`,`{
 "idx": 363,
 "bid_id": "125204",
 "decision": "OPEN",
 "reason": "Tree pruning, plant beds, VDOT
 right-of-way"
}`],notes:["Neither tracer is in this file. Bid A and Bid B were both first seen on earlier nights, so neither of them was triaged on 28 July. Their decisions live in triage-carryover.json instead. Showing them here would be an invention. The two records above are the real ones from this run's 85."],tables:[]}],notes:[],then:"most portals go fetch descriptions here. This one already has them"},{n:"4",title:"Fetch the descriptions: nothing to do",who:"ps.enrich_opens(PORTAL, config, open_ids)",summary:["On other portals this is where a browser visits each kept bid to go get the scope text. Here the step is a deliberate no-op. The search feed already handed over the full scope at stage 1, so the engine's enrich function returns zero and moves on.","The real detail-page visit for eVA does happen, but much later and against a different store. It is stage 11."],cells:[{label:"In",paths:[{path:"runs/triage-verdicts.json",size:"the 7 OPEN ids"}],blocks:[],notes:[],tables:[]},{label:"Out",paths:[{path:"nothing",size:"no file, no network call, by design"}],blocks:[],notes:["This is the payoff for a feed that ships scope text with the listing. Compare a portal like DemandStar, where the whole judging quality depends on whether a detail page renders."],tables:[]}],notes:[],then:"the judging set is assembled"},{n:"5",title:"Who gets scored tonight",who:"ps.build_judge_input_open(PORTAL)",summary:["This step gathers two groups: the bids this run marked OPEN, and any carryover OPEN that somehow still has no verdict. Then it rebuilds each one's description block from the current snapshot so the judge reads today's text, not last week's.","That night the answer was 7 bids, all of them from tonight's Pass 1. None of the 30 carryover OPENs was added. By the end of the night all 37 OPEN bids have a verdict row, and stats.json records verdicts_unresolved: 0."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json",size:"7 OPEN"},{path:"runs/triage-carryover.json",size:"30 OPEN, all already scored"},{path:"data/va-eva/daily/*/verdicts.json",size:"who already has a verdict"},{path:"data/va-eva/bids/all-bids.json",size:"the fresh description text"},{path:"runs/judge-input-open.json",size:"7,586 bytes · 7 rows"}],blocks:[],notes:["The 7 ids, exactly as they sit in the file: 125001, 124443, 124834, 124423, 125121, 125179, 125204. Bid B is not among them."],tables:[]},{label:"Real record · the one that becomes tonight's only YES",paths:[],blocks:[`{
 "idx": 363,
 "bid_id": "125204",
 "title": "To provide the necessary equipment,
 personnel, supervision, and materials to
 perform general plant bed maintenance, tree
 pruning… counties of Arlington, Fairfax,
 Fauquier, L",
 "buyer": "Virginia Department of Transportation",
 "state": "VA",
 "due_date": "2026-08-21",
 "detail_url": "https://mvendor.cgieva.com/Vendor/
 public/IVDetails.jsp?PageTitle=SO%20Details
 &rfp_id_lot=125204&rfp_id_round=0",
 "description_full": "Title: To provide the necessary
 equipment…\\nBuyer: Virginia Department of
 Transportation\\nState: VA\\nCloses: 2026-08-21
 \\nSource URL: https://mvendor.cgieva.com/…
 \\n\\nRFP body:\\nTo provide the necessary
 equipment, personnel, supervision, and
 materials to perform general plant bed
 maintenance, tree pruning, and mulching of
 plant beds and tree rings within the VDOT
 right-of-way along select routes. All sites
 are located within the counties of Arlington,
 Fairfax, Fauquier, Loudoun, and Prince
 William."
}`],notes:['The truncated title stops at "Fauquier, L", but the RFP body underneath it runs to the full sentence. The judge sees both, so the 300-character cut does not cost it anything here.'],tables:[]}],notes:[],then:"seven bids get scored"},{n:"6",title:"Pass 2: would LGS actually bid this?",who:"max-bid-judge · AI (fallback general-purpose)",summary:["Yes, maybe or no, a score out of 100, a written reason, and lists of good signs and warning signs. Seven bids in, seven verdicts out, written at 16:15 local time, five minutes after the judging set was built.",`That night's real split: 1 yes, 4 maybe, 2 no. Every one of the seven carries "_first_judged": "2026-07-28", which is how we know the judge really ran and this file is not left over from an earlier night.`],cells:[{label:"In → Out",paths:[{path:"runs/judge-input-open.json",size:"7,586 bytes · 7 rows"},{path:"runs/judge-verdicts.json",size:"10,520 bytes · 7 rows · 18 fields"}],blocks:[`125001 maybe 48
124443 maybe 58
124834 maybe 65
124423 no 20
125121 no 30
125179 maybe 65
125204 yes 74`],notes:["Bid B is not in this file either. It was judged on 21 July and scored 88 that day. Tonight it was never re-read. Its verdict reaches today's archive at the next stage, by being copied, not by being re-earned."],tables:[]},{label:"Real record · the only YES judged that night",paths:[],blocks:[`{
 "bid_id": "125204",
 "verdict": "yes",
 "would_lgs_bid": "yes",
 "score": 74,
 "lgs_score": 74,
 "primary_reason": "Tree pruning inside VDOT
 right-of-way along select routes spanning
 five counties is the multi-county DOT ROW
 shape LGS wins. The ornamental bed and
 mulching emphasis means the tree work isn't
 the whole scope, so price it with eyes open.",
 "reasoning": "Tree pruning inside VDOT right-of-
 way along select routes… price it with eyes
 open.",
 "service_match": "core",
 "scale_match": "core",
 "buyer_match": "core",
 "red_flags": [
 "out_of_core_state",
 "ornamental_plant_bed_and_mulching_is_
 landscape_maintenance_not_core_row",
 "tree_pruning_may_be_a_minority_of_the_
 pay_items",
 "northern_va_labor_and_traffic_control_
 cost_exposure"
 ],
 "fit_signals": [
 "state_dot_buyer",
 "vdot_right_of_way_scope",
 "tree_pruning_core_service",
 "multi_county_arlington_fairfax_fauquier_
 loudoun_prince_william",
 "multi_route_corridor_work",
 "contractor_supplies_equipment_personnel_
 supervision"
 ],
 "title": "To provide the necessary equipment…
 Loudoun, and Prince William.",
 "buyer": "Virginia Department of Transportation",
 "state": "VA",
 "due_date": "2026-08-21",
 "detail_url": "https://mvendor.cgieva.com/Vendor/
 public/IVDetails.jsp?PageTitle=SO%20Details
 &rfp_id_lot=125204&rfp_id_round=0",
 "_first_judged": "2026-07-28"
}`],notes:["Every va-eva yes and maybe carries out_of_core_state. Virginia is outside the eight states LGS calls home, so the flag is automatic, not a mark against this particular bid."],tables:[]}],notes:[],then:"tonight's answers are folded together with every earlier answer"},{n:"7",title:"Write the day's folder, and carry the past forward",who:"ps.compile_archive(PORTAL, config)",summary:["This is the stage that turns 7 verdicts into 37. It merges the carryover decisions with tonight's triage, then pulls in every earlier verdict whose bid is still in tonight's snapshot, and adds tonight's seven on top. All of it is written as one day's answer.",'So daily/2026-07-28/verdicts.json is not "what happened tonight". It is "every live verdict as of tonight". The _first_judged stamps spread across 23 June, 15 July, 20, 21, 23, 24 and 28 July. Two rows have no stamp at all.'],cells:[{label:"Out · data/va-eva/daily/2026-07-28/",paths:[],blocks:[],notes:['This is the carry-forward. It is the reason stage 8 stays switched off, and the reason a single YES night reads as "8 YES" in every roll-up that quotes stats.json.',"Also appends one row to data/va-eva/daily/INDEX.md. Note that new-bids.json is named for new bids but holds all 517, byte-for-byte the same as the snapshot."],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","517 rows, the whole snapshot","642,840 B"]},{header:!1,cells:["triage.json","517 decisions: 480 SKIP, 37 OPEN","61,929 B"]},{header:!1,cells:["verdicts.json","37 verdicts: 8 yes, 8 maybe, 21 no","41,760 B"]},{header:!1,cells:["stats.json","the funnel counts","472 B"]},{header:!1,cells:["report.md","the operator summary","10,109 B"]}]]},{label:"Real record Bid B · copied forward, judged 21 July",paths:[],blocks:[`{
 "bid_id": "124749",
 "verdict": "yes",
 "would_lgs_bid": "yes",
 "score": 88,
 "lgs_score": 88,
 "primary_reason": "Citywide continuous vegetative
 maintenance of ROW, landscape easements, and
 roadway medians for Virginia Beach is a
 textbook Category 2/4 ROW vegetation-
 management match LGS has repeatedly won.",
 "reasoning": "Citywide continuous vegetative
 maintenance of ROW… LGS has repeatedly won.",
 "red_flags": ["out_of_core_state"],
 "title": "The City of Virginia Beach is accepting
 sealed bids from qualified individuals or
 organizations to provide complete and
 continuous vegetative maintenance at all
 Rights-of-Way, landscape easements, and
 roadway medians, and all other work connected
 thereto as specified. In the Scope of Work.",
 "buyer": "City of Virginia Beach",
 "state": "VA",
 "due_date": "2026-08-24",
 "detail_url": "https://mvendor.cgieva.com/Vendor/
 public/IVDetails.jsp?PageTitle=SO%20Details
 &rfp_id_lot=124749&rfp_id_round=0",
 "_first_judged": "2026-07-21"
}`],notes:[],tables:[]}],notes:["Eight different record shapes in one 37-row file. Some rows carry buyer, due_date and detail_url; some carry only bid_id, a score and a reason. Seven rows also carry service_match, scale_match, fit_signals and a bid_key. Three rows carry a stray top-level out_of_core_state: true alongside the same flag inside red_flags. Two rows (124380, 124446) have no _first_judged at all. One YES row (123224, score 82) has an empty title, so the board and the report have to fall back to the snapshot for its name. The compile step does normalize the verdict word and the score, which is why the counts still add up."],then:"the portal's own night is over. The shared machinery takes over"},{n:"8",title:"Carry forward: correctly skipped, but hand-run three times anyway",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:[`There is a shared safety net that rescues verdicts for bids that fell out of a night's pull. It only touches portals whose registry entry says carry_forward: "orchestrator". eVA says "engine-internal", which means this portal is not in it, on purpose. Stage 7 already did the job. Running the shared script here would apply carry-forward a second time.`,"In plain terms: for eVA this stage does nothing, and that is the right answer."],cells:[{label:"Except it has been forced, three times",paths:[],blocks:[],notes:["The stamps never wash out. Only two of the three runs actually moved a verdict: the audits record 3 rows carried on 9 June, 2 on 23 June and 0 on 15 July. So exactly two of the 36 daily verdict files, 9 June and 23 June, carry this script's own marks _carryforward_from and _in_today_snapshot. The third stamp, _first_judged, is not proof of a hand-run — the portal's own compile writes it too — and it now sits in 23 of the 36 files. Because stage 7 copies old verdicts into every new day, all of these marks ride forward for as long as the bid stays open. Two portals that were never hand-run, sam-gov and fedconnect, carry none of the three at all."],tables:[[{header:!0,cells:["Evidence on disk","What it means"]},{header:!1,cells:["data/va-eva/daily/2026-06-09/_carryforward_audit.json","The shared script writes this file only when it actually runs on a portal. Three of them exist. Someone ran it with --portal va-eva, which bypasses the registry check, on a portal that already carries verdicts forward by itself."]},{header:!1,cells:["data/va-eva/daily/2026-06-23/_carryforward_audit.json"]},{header:!1,cells:["data/va-eva/daily/2026-07-15/_carryforward_audit.json"]}]]}],notes:[],then:"the ledger, the report and the board fixture"},{n:"9",title:"Ledger, report, fixture",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py + dump_activity_matrix.py",summary:["Three shared steps in a row. The ledger walks every dated verdict file for every portal and keeps the yes and the maybe rows, split into live and closed by their due date. The report step overwrites the report.md stage 7 just wrote with the one shared operator layout. Then the fixture dump turns verdicts into board cards.","This is where every eVA MAYBE dies. The fixture dump only takes yes rows for portals that are not federal, and eVA is not federal. The 8 MAYBEs from 28 July are counted in the ledger and then go no further."],cells:[{label:"In → Out",paths:[{path:"data/va-eva/daily/*/verdicts.json",size:"all 36 dates"},{path:"data/va-eva/bids/all-bids.json",size:"overlaid so contact fields ride along"},{path:"data/portals/cumulative-yes.json + .md",size:"yes and maybe both land here"},{path:"data/va-eva/daily/2026-07-28/report.md",size:"rewritten · 10,109 bytes"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"1,470 cards total"},{path:"PortalPro/src/fixtures/activity-matrix.json",size:null}],blocks:[],notes:['The fixture on disk right now holds 22 va-eva cards, every one of them verdict: "yes", zero maybe. That is 22 across all 36 archive days, not 22 tonight. The baseline model doc says 21 as of 26 July, so the file has moved on by one card since that map was written.'],tables:[]},{label:"Fixture header, read off disk",paths:[],blocks:[`{
 "generated_at": "2026-07-28T22:38:01+00:00",
 "last_run_dates": { "va-eva": "2026-07-28" }
}`,`# eVA Virginia — 2026-07-28

**Source:** https://mvendor.cgieva.com/Vendor/
public/AllOpportunities.jsp · engine \`eva\`
· state VA

- Snapshot: **517** open bids
- Carryover: 432 · NEW today: 85
- Triage: 37 OPEN / 480 SKIP
- Scored: **8 YES / 8 MAYBE / 21 NO**`],notes:["The report says 8 YES and the report is right about the file. It just does not say that 7 of those 8 were decided on earlier nights."],tables:[]}],notes:[],then:"bids stop being Virginia's bids here"},{n:"10",title:"Publish, cluster, dedup",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["The YES cards are pushed into the shared board database and then clustered against every other portal's bids. From this point the unit is a cluster, not a va-eva row. If the same Virginia Beach contract also shows up on another board, the two collapse into one thing for the operator to look at.","The run also writes one row per portal per day into a runs table, so the board can show the funnel without re-reading the archive."],cells:[{label:"In → Out",paths:[{path:"PortalPro/src/fixtures/portal-bids.json",size:"22 va-eva cards"},{path:"data/va-eva/daily/2026-07-28/stats.json",size:"the counts for the runs table"},{path:"supabase.portals",size:'key "va-eva" + label "eVA Virginia"'},{path:"supabase.bids",size:"one row per YES"},{path:"supabase.clusters",size:"cluster id + canonical bid"},{path:"supabase.sweep_runs",size:"yes / maybe / open / raw / no counts"}],blocks:[],notes:[],tables:[]},{label:"Real card Bid B on the board",paths:[],blocks:[`{
 "id": "b8b49b51c6f96d11",
 "portal": "va-eva",
 "portal_label": "eVA Virginia",
 "source_bid_id": "124749",
 "title": "The City of Virginia Beach is accepting
 sealed bids… vegetative maintenance at all
 Rights-of-Way, landscape easements, and
 roadway medians…",
 "buyer": "City of Virginia Beach",
 "state": "VA",
 "solicitation_no": "COVB-26-101684 Landscape
 Maintenance for Virginia Beach Blvd",
 "federal": false,
 "score": 88,
 "verdict": "yes",
 "category": "",
 "due_date": "2026-08-24",
 "contact_name": "David Narr",
 "contact_email": null,
 "contact_phone": null,
 "red_flags": ["out_of_core_state"],
 "fit_signals": [],
 "first_seen": "2026-07-21",
 "last_seen": "2026-07-28",
 "has_documents": true
}`],notes:["contact_name is filled but contact_email is empty. The feed gives us a person's name and nothing to reach them with. The email is the job of the next stage. And has_documents: true is worth noticing, because the shared gap-reason table and this portal's own README both still say eVA documents cannot be downloaded."],tables:[]}],notes:[],then:"now the detail pages get visited, for real"},{n:"11",title:"Documents, contact email, requirements",who:'2.85b run_enrichment_phase.py (pass "eva (recaptcha)") · 2.87 extract_doc_text.py + apply_requirements.py',summary:["Now the detail pages are opened, one per published bid. eVA guards them with a robot check, so this pass runs in headless Firefox, clears the check once, then walks each bid's page to pull the buyer's email, the real description and the attachment list, and downloads the files.","Chromium gets refused on these pages. Firefox is not a preference here, it is the only browser that gets through.",'Then the requirements step works per cluster: whatever document text landed gets turned into requirement rows. A cluster with no material gets a plain "no material" row so the board never shows a blank pill.'],cells:[{label:"In → Out",paths:[{path:"supabase.bids",size:"published va-eva rows, read not written by disk"},{path:"mvendor.cgieva.com/…/IVDetails.jsp",size:"one visit per bid"},{path:"procure.cgieva.com/…/download_public/<GUID>",size:"the file bytes"},{path:"supabase.bids",size:"patched: contact_email, description"},{path:"supabase storage bucket bid-docs",size:"{cluster_id}/documents/{ts}-{file}"},{path:"supabase.bid_documents",size:"one row per file"},{path:"supabase.bid_requirements",size:"per cluster"},{path:"data/portals/requirements-manifest.json + requirements-input.json",size:null}],blocks:[],notes:[],tables:[]},{label:"What can go wrong, and what the docs get wrong",paths:[],blocks:[],notes:["Careful with the document claim. One board card carrying documents proves the path can work. It does not prove full coverage. This portal's own runbook says 7% document coverage, measured 14 July. It has been re-measured since: data/portals/sentinel.json, written 30 July, puts va-eva at 36% docs and 82% contact and flags it AMBER for thin capture. So the path did open up after the robot check changed, and 36% is still a long way from full."],tables:[[{header:!0,cells:["Thing","State"]},{header:!1,cells:["First robot check fails three times","the whole pass stops and not one bid is enriched that night"]},{header:!1,cells:["Chromium on the detail page","refused. Firefox required"]},{header:!1,cells:["Heavy automation","eVA throttles the address; the next run from a fresh address recovers"]},{header:!1,cells:["The gap-reason table and the portal README","both still say the files cannot be downloaded. The enrichment code says the gate moved to an invisible check that Firefox passes with no solver, and the board card for Bid B says has_documents: true"]},{header:!1,cells:["MAYBE rows","the pass is configured for yes and maybe, but no eVA maybe ever reaches the board, so half its target set cannot exist"]}]]}],notes:[],then:"now that blanks are filled, look for duplicates again"},{n:"12",title:"Second look for duplicates",who:"2.875 · llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["The dedup at stage 10 ran on thin data. Stage 11 has since filled in buyers, due dates and solicitation numbers, which makes pairs comparable that were not comparable before. This pass judges only that residue, usually a handful of pairs.","If nothing new became comparable, the count comes back zero and the AI judge is not called at all. Every pair already decided is remembered, so running the chain twice in a day cannot collapse the same two bids twice."],cells:[{label:"Why this matters more for eVA than for most portals",paths:[],blocks:[],notes:[`eVA's solicitation_no is not a bare number. It is a number glued to a name, like "COVB-26-101684 Landscape Maintenance for Virginia Beach Blvd" or "161100 Landscape Maintenance Services". A matcher that expects a clean reference number will not find one here. The pairing has to lean on buyer, due date and the scope text instead, which is exactly the data stage 11 just improved.`,"The title field being a 300-character scope extract cuts both ways. It gives the matcher a lot of text to compare, and it means two genuinely different jobs from the same buyer can open with near-identical boilerplate."],tables:[]}],notes:[],then:"what changed, who gets told, did the run actually finish"},{n:"13",title:"Watch, digests, and the run check",who:"2.88 · watch_list_signals.py · new_bids_email.py · bid_watch.py · pipeline_sentinel.py",summary:["eVA's watch mode is none, so no bid on this portal gets its page re-fetched looking for a late addendum. The free list-level signal still runs, the discovery digest picks up any eVA cluster first seen today, and the sentinel checks that this portal's phases really ran.","The emails are written but not sent. They stay a silent no-op until an email key is put in place."],cells:[{label:"Where an eVA bid finally comes to rest",paths:[],blocks:[],notes:[],tables:[[{header:!0,cells:["Step","State for eVA"]},{header:!1,cells:["Source re-capture of watched bids","off. Registry watch is none"]},{header:!1,cells:["Free list-diff signal","runs"]},{header:!1,cells:["Discovery digest and deadline alerts","written, not delivered, until RESEND_API_KEY is set in data/auth/resend.env"]},{header:!1,cells:["Sentinel",`writes data/portals/sentinel.json. The copy on disk was written 30 July and marks va-eva AMBER with one issue, "thin capture: contact 82% docs 36%", last archive 2026-07-28, 22 surfaced. The word paywalled is not sentinel's — it is the 14 July health snapshot inside data/va-eva/PORTAL.md, copied there from the live coverage table`]}],[{header:!0,cells:["Phase","Terminal"]},{header:!1,cells:["2.89","bid packs: data/bidpacks/{pack_key}/BID.md and packs-index.json"]},{header:!1,cells:["2.9 to 2.95","data/portals/metrics.json, overlap.json, monitor.html, overview.html. The metrics builder re-reads every daily/*/stats.json this portal has. The copy on disk is older than this run: it was generated 24 July and still records latest_snapshot: 507"]},{header:!1,cells:["P3 to P4.99","the operator's roll-up.md, and data/portals/scorecard.csv, which is the only YES number anyone is allowed to quote. Adding up per-portal scoring.yes is explicitly not allowed, and stage 7 is the reason why"]},{header:!1,cells:["the board","PortalPro and shessi.dev/lgs, 22 va-eva cards"]}]]}],notes:[],then:null}],d=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["title is not a title. It is the first 300 characters of the scope text, cut mid-word",'middle title length is 251 characters, 303 of 517 rows have title identical to description. The short human name lives in solicitation_no. Any board, email or report that prints "the title" prints a paragraph']},{header:!1,cells:["Stage 7 copies every still-live verdict into every new day's file",'"8 YES on 28 July" was really 1 YES judged that night plus 7 older ones. Sums of scoring.yes across days double-count the same bid many times over']},{header:!1,cells:["The pull has no zero-row floor guard","a throttled or blocked run writes an empty snapshot over a healthy 517-row file. Next morning every bid looks new and all 517 go to the AI. Five sibling engines refuse this — govconapi.py and prorfx.py keep the old file behind a floor guard, bidexpress.py, ionwave.py and sc_sceis.py raise before writing. This one does neither"]},{header:!1,cells:["Every MAYBE is a dead end","8 MAYBE on 28 July. The fixture dump takes yes only for non-federal portals, so no MAYBE reaches the board, the database, the document pass or the operator. They exist only in the archive and the cumulative ledger"]},{header:!1,cells:["Shared carry-forward was hand-run on an engine-internal portal, three times","audit files dated 9 June, 23 June and 15 July, which carried 3, 2 and 0 verdicts. Only the first two archive files carry the script's own marks _carryforward_from and _in_today_snapshot; _first_judged, which the portal's own compile also writes, sits in 23 of the 36. Stage 7 rides all of them forward for as long as the bid stays open"]},{header:!1,cells:['The one YES judged on 28 July scored its size as "scale_match": "core"',"the other six bids judged that night said small or unknown, and across the whole 37-row archive file only this bid says core. Sibling portals use above_floor and below_floor here. The size field is not being answered from one shared word list, so do not sort or filter on it"]},{header:!1,cells:["The verdicts file holds eight different record shapes","2 rows with no _first_judged, 3 rows with a stray top-level out_of_core_state, 1 YES row (123224) with an empty title. Compile normalizes the verdict word and score, nothing else"]},{header:!1,cells:["Two documents say the attachments cannot be downloaded. The code says they can","scripts/gap_reasons.py:76-79 and data/va-eva/README.md:28-33 both describe a robot check that beat the free solver. open folders/_lib/eva_enrich.py:12-22 records that the gate moved to an invisible check Firefox passes, and Bid B's board card says has_documents: true. The written docs are stale. Coverage did move: PORTAL.md says 7% on 14 July, data/portals/sentinel.json says 36% on 30 July"]},{header:!1,cells:["data/va-eva/PORTAL.md is not a usable runbook","it carries DemandStar's gap note about a $5 per bid download fee, which is the wrong portal entirely, and every field-map row says TODO. It is an auto-generated 14 July draft"]},{header:!1,cells:["runs/judge-input.json is rebuilt for all 517 bids every run","703,244 bytes written to produce a 7,586-byte judging set of 7. Measured on this run"]},{header:!1,cells:["data/va-eva/runs/_triage_rows.txt, 10,091 bytes, last touched 18 June","a grep across the repo and the skills folder found no script that writes or reads it. Operator scratch from a June run, still sitting there"]},{header:!1,cells:["A second, older code path for the same portal: engine/connectors/api/virginia_eva.py","14 KB, dated 6 May, registered in engine/run_all_active.py:33, referenced nowhere in the nightly flow. Dead or parked, nobody has said which"]},{header:!1,cells:["The search box only answers one exact question","it rejects plain web requests, caps results at about 15 per call, whitelists the sort, and needs the status filter written exactly right. Change any of it and the answer is blank, not an error"]},{header:!1,cells:["Every yes and maybe carries out_of_core_state","Virginia sits outside LGS's eight core states. The flag is automatic, so it carries no information about a particular bid. Do not read it as a warning"]},{header:!1,cells:["The baseline model doc is behind the disk","it says 507 bids on 24 July and 21 fixture cards as of 26 July. Disk says 517 bids on 28 July and 22 cards. It also notes judge-input-open.json at 717 bytes; here it is 7,586 bytes with 7 rows. The files win"]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026, this portal's newest archive of 36. Every record above was read from the named file on disk and copied, not retyped. Long strings are shortened with … and never reworded. Every count traces to data/va-eva/daily/2026-07-28/stats.json, runs/_funnel.json, a row count or a byte size. Baseline map: docs/portal-dataflow/va-eva.md, cited to file and line. Where that map and the files disagree, the files win and the page says so."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026, this portal's newest archive of 36. Every record above was read from the named file on disk and copied, not retyped. Long strings are shortened with … and never reworded. Every count traces to data/va-eva/daily/2026-07-28/stats.json, runs/_funnel.json, a row count or a byte size. Baseline map: docs/portal-dataflow/va-eva.md, cited to file and line. Where that map and the files disagree, the files win and the page says so.",c="docs/portal-dataflow/pedia-va-eva.html",p={slug:e,title:t,eyebrow:a,headline:s,lede:n,funnel:o,funnel_note:r,legend:i,stages:l,sections:d,footer:h,source_page:c};export{p as default,a as eyebrow,h as footer,o as funnel,r as funnel_note,s as headline,n as lede,i as legend,d as sections,e as slug,c as source_page,l as stages,t as title};
