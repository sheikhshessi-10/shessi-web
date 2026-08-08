const e="infor-cloudsuite-ports",t="Infor CloudSuite Supplier Portal: what happens to a bid, stage by stage",s="Portal pedia · 22",a="Infor CloudSuite: three city boards, one JSON call each, and three bids that vanish",n="Every stage of the run of 28 July 2026, with a real record from the actual files at each step. Two bids are followed. One is skipped. One scores 58, the best this portal has ever produced, and still never reaches the board. And three bids in the pull never get a decision of their own at all.",r=[{value:"23",label:"in snapshot"},{value:"2",label:"new tonight"},{value:"20",label:"triaged"},{value:"2",label:"triage says open"},{value:"0",label:"yes"},{value:"2",label:"maybe"}],o="Sources: data/infor-cloudsuite-ports/daily/2026-07-28/stats.json (432 bytes) and data/infor-cloudsuite-ports/bids/all-bids.json (18,172 bytes, 23 rows). Carryover that night: 21. Three cities were polled and all three answered: coralgables 5, nola 10, fortlauderdale 8, per bids/index.json.",i=["Bid A · …-598 · CCTV Inspection, Inflow and Infiltration Repairs, Fort Lauderdale. SKIP, decided on an earlier run.","Bid B · …-654 · Turf Grass Maintenance, Fort Lauderdale. The only bid that walks the whole path. Ends MAYBE, score 58."],l=[{n:"0",title:"Is this portal even due today?",who:"scripts/portal_due.py --batch portals",summary:["This portal does not run nightly. It runs every three days. The gate looks at the newest dated folder under data/infor-cloudsuite-ports/daily/. If that folder is three or more days old, the slug is printed as due. Otherwise nothing runs.","The previous folder was 2026-07-23, five days back. So the portal was due, and 28 July is the run this page follows."],cells:[{label:"In",paths:[{path:"data/portals/registry.json",size:"cadence_days: 3"},{path:"supabase.portals",size:"cadence read live, registry.json is the fallback"},{path:"data/infor-cloudsuite-ports/daily/",size:"8 dated folders on record"}],blocks:[],notes:[],tables:[]},{label:"The registry row that decides everything downstream",paths:[],blocks:[`{
 "slug": "infor-cloudsuite-ports",
 "label": "Infor CloudSuite Supplier Portal (multi-agency)",
 "engine": "infor_cloudsuite",
 "batch": "portals",
 "cadence_days": 3,
 "authed": false,
 "enrich_passes": [],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:["Four of these fields switch whole stages off later: enrich_passes empty, watch none, authed false, and carry_forward engine-internal."],tables:[]}],notes:[],then:"the slug is handed to a child agent"},{n:"1",title:"The orchestrator hands off",who:"Agent(general-purpose) → .claude/skills/infor-cloudsuite-ports-sweep/SKILL.md",summary:["The portal sits in Batch I of the /portals run, next to sc-sceis, prorfx, fedconnect and sam-gov. One child agent is told to read the sweep skill and run it end to end. When the child reports back, the orchestrator ignores the summary and trusts the files on disk."],cells:[{label:"In → Out",paths:[{path:".claude/skills/infor-cloudsuite-ports-sweep/SKILL.md",size:"the runbook"},{path:"child agent process",size:"runs pull → prep → triage → judge → compile"}],blocks:[],notes:[],tables:[]},{label:"A contradiction that has not bitten yet",paths:[],blocks:[],notes:["The portals skill states Batch I twice and the two statements disagree. Line 40 lists four slugs and leaves this portal out. Line 187, the dispatch block the orchestrator actually reads, lists five and includes it. The dispatch line wins today, which is why the run happened. Nothing keeps the two in step."],tables:[]}],notes:[],then:"three plain web calls, no login, no browser"},{n:"2",title:"Pull all three cities",who:"data/infor-cloudsuite-ports/scripts/run_daily.py → open folders/_lib/engines/infor_cloudsuite.py",summary:["One plain web request per city. No password, no cookies, no headless browser. Each city returns a list of its open bidding events as JSON, and every row is flattened into our standard bid shape.","The list is everything we ever get. There is no second page to fetch. Clicking an event on the real site opens a panel inside the app, not a new address, so there is no per-bid link to follow. The description you see below is not scraped text. It is built by the engine by joining whichever of six list fields are not blank: bid type, category, sub-category, reference, currency, and the bid-bond line. On every Fort Lauderdale row only three survive, which is why the description below is one short line."],cells:[{label:"In → Out",paths:[{path:"https://sms-{host_slug}-prd.inforcloudsuite.com/fsm/SupplyManagementSupplier/list/SourcingEvent.XiOpenForBid?…&csk.SupplierGroup={code}",size:"one call per city"},{path:"data/infor-cloudsuite-ports/config.json",size:"3 tenants: coralgables, nola, fortlauderdale"},{path:"bids/all-bids.json",size:"18,172 bytes · 23 rows · 16 fields"},{path:"bids/index.json",size:"439 bytes"},{path:"logs/pull_log.txt",size:"7,804 bytes, appended every run"}],blocks:[`[2026-07-28T21:57:05.066538+00:00] Infor CloudSuite
 (Xi Supplier Portal) pull starting · 3 tenant(s) ·
 today=2026-07-28
[2026-07-28T21:57:06.644994+00:00] [sms-coralgables-
 prd.inforcloudsuite.com] 5 open · buyer=City of
 Coral Gables
[2026-07-28T21:57:08.689309+00:00] [sms-nola-prd.
 inforcloudsuite.com] 10 open · buyer=City of New
 Orleans
[2026-07-28T21:57:13.210841+00:00] [sms-fortlauderdale-
 prd.inforcloudsuite.com] 8 open · buyer=City of
 Fort Lauderdale
[2026-07-28T21:57:13.213555+00:00] wrote 23 open bids
 across 3/3 tenants …`],notes:[],tables:[]},{label:"Real record Bid A from bids/all-bids.json",paths:[],blocks:[`{
 "bid_id": "sms-fortlauderdale-prd.inforcloudsuite.com-598",
 "ref_number": "",
 "title": "CCTV Inspection, Inflow and
 Infiltration Repairs",
 "buyer": "City of Fort Lauderdale",
 "agency": "City of Fort Lauderdale",
 "status": "open",
 "due_date": "2026-07-30",
 "posting_date": "2026-04-06",
 "bid_type": "IFB",
 "categories": "",
 "state": "FL",
 "detail_url": "https://sms-fortlauderdale-prd.
 inforcloudsuite.com/fsm/SupplyManagementSupplier/
 page/EventPage?csk_SupplierGroup=COFL&menu=
 XiSupplierHome.EventListings&selectedPanel=
 BrowseOpenEvents",
 "description": "Type: IFB · Currency: USD · A bid
 bond must be provided when responding",
 "contact": "",
 "documents_gated": true,
 "_detail_ok": true
}`],notes:["contact is empty, categories is empty, and documents_gated is stamped true on every single row. That detail_url is the city's event list page. Every Fort Lauderdale bid on this portal carries the exact same one."],tables:[]}],notes:[`The id trap is born here. The engine uses the event's reference field as the bid id, and only falls back to host plus event number when the reference is blank. Coral Gables puts a real solicitation number there (IFB 2026-024). Fort Lauderdale leaves it blank, so it gets the stable host-and-number id you see above. New Orleans puts the department name there. Three separate New Orleans bids in this pull all carry bid_id: "Chief Administrative Office", and two more carry "Department of Public Works". Twenty-three rows, twenty ids.`],then:"today's ids are compared against the last archive"},{n:"3",title:"Diff against the last run",who:"open folders/_lib/platform_sweep.py · ps.prep",summary:["Today's 23 ids are matched against the newest earlier archive, which was daily/2026-07-23/triage.json with 20 rows in it. An id seen before keeps its old OPEN or SKIP answer as carryover and costs nothing. Only a genuinely new id goes to the AI. Every row, new or not, also gets a judge-ready text blob written for it.","Two ids were new. Both were Fort Lauderdale. That is the whole of tonight's AI triage bill."],cells:[{label:"In → Out",paths:[{path:"bids/all-bids.json",size:"23 rows"},{path:"daily/2026-07-23/triage.json",size:"20 prior ids"},{path:"runs/triage-input.json",size:"501 bytes · 2 rows"},{path:"runs/triage-carryover.json",size:"3,027 bytes · 21 rows"},{path:"runs/judge-input.json",size:"20,420 bytes · 23 rows"},{path:"runs/_funnel.json",size:"152 bytes"}],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 23,
 "carryover_count": 21,
 "triage_input_count": 2,
 "prior_archive_ids_compared_against": 20
}`],notes:[],tables:[]},{label:"Real record Bid A from runs/triage-carryover.json",paths:[],blocks:[`{
 "bid_id": "sms-fortlauderdale-prd.inforcloudsuite.com-598",
 "decision": "SKIP",
 "reason": "CCTV sewer inspection, wrong vertical"
}`,`{
 "idx": 16,
 "bid_id": "Chief Administrative Office",
 "decision": "SKIP",
 "reason": "eligibility audit, professional admin"
}`],notes:["Bid A's whole night is this line. It was judged not-for-us on an earlier run and the answer was copied forward, unread.",'That exact record appears three times in the 21-row carryover file, and "Department of Public Works" appears twice. 21 rows, 18 different ids, plus the 2 new ones, makes the 20 rows the archive ends up with.'],tables:[]}],notes:[`This is where the damage lands. Both "Chief Administrative Office" and "Department of Public Works" were already ids in the 23 July archive, so every New Orleans row carrying either one was waved through as already-seen. Two of those rows had never been seen before. Re-Bid 3 Unemployment Cost and Claims Management, posted 27 July, the day before this run, came in under "Chief Administrative Office" and inherited the decision written about the Dependent Eligibility Audit bid: "eligibility audit, professional admin". RFP - Infrastructure Program Management Support Services, posted 23 July after that day's run, came in under "Department of Public Works" and inherited the decision written about Street Light Master Plan: "master plan study, no LGS verb". Neither has ever been read by triage or by the judge, and neither ever will be, because the next event those departments post will inherit the same id again.`],then:"two titles go to the AI"},{n:"4",title:"Triage, pass one",who:"max-triage · AI",summary:["The AI gets six fields per bid and answers OPEN or SKIP with a short reason. There is no description to send at this stage, so it is working from the title, the city and the closing date. Default is SKIP. OPEN only when the title names work LGS actually does, or the buyer is a utility hiding behind a cryptic name.","Bid A is not on this page. It was not new, so it never reached the AI tonight. What follows are the only two bids that did."],cells:[{label:"In · runs/triage-input.json, whole file, 501 bytes",paths:[],blocks:[`[
 {
 "idx": 7,
 "bid_id": "sms-fortlauderdale-prd.
 inforcloudsuite.com-654",
 "title": "Turf Grass Maintenance - Fire ,
 Parking , Utility Plants",
 "buyer": "City of Fort Lauderdale",
 "state": "FL",
 "due_date": "2026-08-07"
 },
 {
 "idx": 20,
 "bid_id": "sms-fortlauderdale-prd.
 inforcloudsuite.com-656",
 "title": "Benefit Consulting and Actuarial
 Services",
 "buyer": "City of Fort Lauderdale",
 "state": "FL",
 "due_date": "2026-08-26"
 }
]`],notes:[],tables:[]},{label:"Out · runs/triage-verdicts.json, whole file, 352 bytes Bid B opened",paths:[],blocks:[`[
 {
 "idx": 7,
 "bid_id": "sms-fortlauderdale-prd.
 inforcloudsuite.com-654",
 "decision": "OPEN",
 "reason": "turf/grounds maintenance verb,
 municipal"
 },
 {
 "idx": 20,
 "bid_id": "sms-fortlauderdale-prd.
 inforcloudsuite.com-656",
 "decision": "SKIP",
 "reason": "actuarial/benefits professional
 services"
 }
]`],notes:["No script writes this file. An agent does. A row it forgets to answer is a silent hole, so the dispatch prompt tells the child to check coverage and ask again."],tables:[]}],notes:[],then:"the OPENs would normally get a deeper look"},{n:"5",title:"Enrich the OPENs, which does nothing here",who:"open folders/_lib/platform_sweep.py · ps.enrich_opens",summary:["On most portals this is the stage that goes and fetches the real scope, the buyer contact and the document list for anything triage kept. Here it returns zero immediately. The glue looks for an enrich_details function on the engine and the Infor engine does not have one.","The sweep runbook still names this as a phase. There is no code behind that name for this engine. This is the single reason the description, the contact and the documents never improve after the pull."],cells:[{label:"In",paths:[{path:"runs/triage-verdicts.json",size:"the OPEN ids"}],blocks:[],notes:[],tables:[]},{label:"Out",paths:[{path:"no write at all",size:"the function returns 0"}],blocks:[],notes:["Nothing on disk changes. The bid the judge sees in two stages' time is exactly the bid the pull wrote."],tables:[]}],notes:[],then:"nothing was written, so the next step reads the same files again"},{n:"6",title:"Pick the OPENs that still need a verdict",who:"open folders/_lib/platform_sweep.py · ps.build_judge_input_open",summary:["Tonight's new OPENs, plus any OPEN carried over from an earlier day that somehow never got scored, get their judge text rebuilt from the current snapshot. Anything already scored on a prior run is left out. Its old verdict gets merged back in at the archive stage instead.","The archive ends with two OPENs, but only one row lands here. The other OPEN, ITB Landscape and Garden Maintenance FMC in New Orleans, was already scored on an earlier run, so it is correctly skipped."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json",size:null},{path:"runs/triage-carryover.json",size:null},{path:"daily/2026-07-23/verdicts.json",size:"who was already scored"},{path:"bids/all-bids.json",size:"the text is rebuilt from here"},{path:"runs/judge-input-open.json",size:"911 bytes · 1 row"}],blocks:[],notes:[],tables:[]},{label:"Real record Bid B from runs/judge-input-open.json",paths:[],blocks:[`{
 "idx": 7,
 "bid_id": "sms-fortlauderdale-prd.inforcloudsuite.com-654",
 "title": "Turf Grass Maintenance - Fire ,
 Parking , Utility Plants",
 "buyer": "City of Fort Lauderdale",
 "state": "FL",
 "due_date": "2026-08-07",
 "detail_url": "https://sms-fortlauderdale-prd.
 inforcloudsuite.com/fsm/SupplyManagementSupplier/
 page/EventPage?csk_SupplierGroup=COFL&menu=…",
 "description_full": "Title: Turf Grass Maintenance -
 Fire , Parking , Utility Plants\\nBuyer: City of
 Fort Lauderdale\\nState: FL\\nCloses: 2026-08-07\\n
 Source URL: https://sms-fortlauderdale-prd.
 inforcloudsuite.com/…\\n\\nRFP body:\\nType: IFB ·
 Currency: USD · A bid bond must be provided
 when responding"
}`],notes:["Look at what sits under the words RFP body: one line of metadata. That is the entire scope the judge will get."],tables:[]}],notes:[],then:"one bid gets a score"},{n:"7",title:"The judge, pass two",who:"max-bid-judge · AI",summary:["Yes, maybe or no, with a score out of 100, a reason and a list of warning flags. One bid was judged that night and it came back maybe, 58.","The judge names our own gap in its reasoning, which is the honest thing to do. It says the description is thin because the public list carries no body text, and calls that our capture gap rather than a fault in the bid."],cells:[{label:"In → Out",paths:[{path:"runs/judge-input-open.json",size:"1 row"},{path:"runs/judge-verdicts.json",size:"1,394 bytes · 1 row"}],blocks:[],notes:["Judges have returned two different key shapes over time. Some rows come back as verdict / lgs_score / reasoning, others as would_lgs_bid / score / primary_reason. The archive stage writes both families onto the same row so nothing downstream has to guess. You can see both on the record in the next card."],tables:[]},{label:"Real record Bid B · maybe, 58 from runs/judge-verdicts.json",paths:[],blocks:[`{
 "bid_id": "sms-fortlauderdale-prd.inforcloudsuite.com-654",
 "title": "Turf Grass Maintenance - Fire ,
 Parking , Utility Plants",
 "buyer": "City of Fort Lauderdale",
 "state": "FL",
 "due_date": "2026-08-07",
 "verdict": "maybe",
 "lgs_score": 58,
 "reasoning": "Multi-site municipal turf
 maintenance across fire stations, parking
 facilities and utility plant grounds for a
 large core-state city (FL) - real grounds-
 maintenance work shape, well above the single-
 building floor… But turf mowing is not in the
 165-win categories: no tree, vegetation-
 management, ROW, or debris verb appears.
 Description is thin because the Infor CloudSuite
 public JSON list carries no RFP body - our
 capture gap, not a defect in the bid…",
 "red_flags": [
 "thin_description_pull_rfp_packet",
 "turf_mowing_not_core_tree_vegetation_trade",
 "multi_site_scope_unverified",
 "bid_bond_required"
 ]
}`],notes:[],tables:[]}],notes:[],then:"the day folder is written"},{n:"8",title:"Write the archive",who:"open folders/_lib/platform_sweep.py · ps.compile_archive",summary:["Carryover decisions and tonight's new ones are merged, yesterday's still-live verdicts are merged with tonight's, the funnel is counted, and the day folder is written. This folder is what every later stage and every other portal's roll-up reads. Re-running the same day just overwrites it.","Note that new-bids.json is not tonight's new bids. It is the full 23-row snapshot. That naming is the same across every portal in the system."],cells:[{label:"Out · data/infor-cloudsuite-ports/daily/2026-07-28/",paths:[],blocks:[`{
 "date": "2026-07-28",
 "source": "infor-cloudsuite-ports",
 "engine": "infor_cloudsuite",
 "endpoint": "",
 "snapshot_total": 23,
 "carryover_count": 21,
 "new_to_triage": 2,
 "triage": {"open": 2, "skip": 18, "total": 20},
 "scoring": {"yes": 0, "maybe": 2, "no": 0, "total": 2},
 "verdicts_unresolved": 0,
 "generated_at": "2026-07-28T22:02:00.729226+00:00"
}`],notes:["endpoint is empty. The compile step reads a config key called entity_url and this portal's config uses a tenants list instead. The endpoint string does exist on disk, in bids/index.json. Nothing reads it across."],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","23 rows, the whole snapshot","18,172 B"]},{header:!1,cells:["triage.json","20 decisions, tomorrow's memory","2,925 B"]},{header:!1,cells:["verdicts.json","2 scored bids","3,679 B"]},{header:!1,cells:["stats.json","the funnel counts","432 B"]},{header:!1,cells:["report.md","human summary","1,445 B"]}]]},{label:"Real record Bid A as the archive keeps it, from daily/2026-07-28/triage.json",paths:[],blocks:[`{
 "bid_id": "sms-fortlauderdale-prd.inforcloudsuite.com-598",
 "decision": "SKIP",
 "reason": "CCTV sewer inspection, wrong vertical"
}`,`{
 "bid_id": "French Market Corporation District",
 "title": "ITB Landscape and Garden
 Maintenance FMC",
 "buyer": "City of New Orleans",
 "state": "LA",
 "due_date": "2026-08-06",
 "verdict": "maybe",
 "lgs_score": 45,
 "would_lgs_bid": "maybe",
 "score": 45,
 "primary_reason": "Bare 'Landscape Maintenance'
 title is ambiguous per persona - municipal
 landscape ITBs often bundle tree/vegetation
 scope only visible in the packet. New Orleans
 LA = core state…",
 "red_flags": [
 "thin_description_platform_design_pull_rfp_packet",
 "service_type_ambiguous_landscape_garden_
 maintenance",
 "low_scale_inferred_single_site_market_district",
 "bid_bond_required"
 ]
}`],notes:["Both key families on one row, exactly as the canonicalizer leaves them. This bid's id is a department-style reference too, which is how New Orleans ids look on this portal."],tables:[]}],notes:["One quiet drop lives here. A verdict whose bid has left the snapshot is filtered out and lost. The shared carry-forward script would have kept it and marked it as gone. That script does not run for this portal, which the next card explains."],then:"the portal's own work is done, the shared machinery takes over"},{n:"9",title:"Carry forward, deliberately off for this portal",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:[`On some portals a shared safety net rescues verdicts for bids that dropped out of one night's pull. This portal is not in that set. Its registry entry says carry_forward: "engine-internal", and --all only picks up slugs whose value is "orchestrator". So the script skips it.`,"That is on purpose, not an oversight. This portal already does its own carrying forward twice inside its own sweep: triage decisions at the diff stage, and judge verdicts at the archive stage. Running the shared merge as well would apply it twice."],cells:[{label:"The proof that it really did not run",paths:[{path:"daily/*/_carryforward_audit.json",size:"absent from all 8 day folders, checked on disk"}],blocks:[],notes:["The cost of doing it in-engine. The in-engine version filters verdicts down to bids still in tonight's snapshot. The shared version keeps them and stamps a flag saying the bid is gone. So a bid that closes between runs loses its score here, where on other portals it would survive as history.","The script writes that audit file whenever it touches a portal. There is not one, on any date, for this slug."],tables:[]}],notes:[],then:"the ledger, the report, and the board fixture"},{n:"10",title:"Ledger, report, fixture",who:"2.6 scripts/portals_cumulative.py · 2.7 scripts/standardize_daily_reports.py · 2.8 scripts/dump_yes_for_portalpro.py",summary:["Three shared steps run over every portal's day folders. One builds the all-time list of every YES ever found. One throws away the compact report the archive wrote and re-renders it so all portals read alike. One flattens YES bids into the file the board publisher reads.","All three come back empty for this portal, for the same reason: only YES publishes, and this portal has never produced one. Across all 8 day folders on disk the verdicts are: five days with none, then one maybe, one maybe, and tonight's two maybes. Zero YES, ever."],cells:[{label:"What each step actually produced",paths:[],blocks:[],notes:["This is where Bid B stops. Score 58, a real Fort Lauderdale grounds contract with a bid bond, and it is a maybe. Maybes do not publish for this slug, so Bid B never becomes a card. The judge asked the operator to pull the packet. Nothing on the board tells the operator to."],tables:[[{header:!0,cells:["Step","Result for this portal"]},{header:!1,cells:["2.6 all-time YES ledger","0 rows contributed. The registry says in_cumulative: true, so it is walked, and it has nothing to give."]},{header:!1,cells:["2.7 standard report","report.md, 1,445 bytes. The renderer takes the source line from the config's entity_url, falling back to stats.endpoint. Both are empty here, so **Source:** renders blank. YES section reads none."]},{header:!1,cells:["2.8 board fixture","0 of the 1,470 cards in PortalPro/src/fixtures/portal-bids.json are from this portal. Counted on disk."]}]]},{label:"report.md's verdict sections · headline lines only, the reason and link line under each bullet trimmed",paths:[],blocks:[`## YES — Max would bid

_none_

## MAYBE — operator judgment

- **[58] Turf Grass Maintenance - Fire ,
 Parking , Utility Plants** — City of Fort
 Lauderdale · closes 2026-08-07
- **[45] ITB Landscape and Garden
 Maintenance FMC** — City of New Orleans ·
 closes 2026-08-06`],notes:["Line 3 of the same file reads **Source:** · engine `infor_cloudsuite`. The gap after Source: is the empty endpoint from the archive stage, showing through to a human."],tables:[]}],notes:[],then:"where bids stop being portal-shaped"},{n:"11",title:"The shared board, the documents, the backstops",who:"2.85 scripts/publish_to_supabase.py · 2.85b scripts/publish_bid_documents.py · 2.85c scripts/run_enrichment_phase.py",summary:["This is the join. Every portal's YES rows are pushed into one shared table and then grouped, so the same solicitation seen on two boards becomes one row. Documents recorded by an engine are uploaded. Standing passes then try to fill missing descriptions and contacts for anything already published.","The fixture this reads is empty for this portal, so nothing of ours is pushed, nothing is grouped, and the standing passes have no row of ours to act on. The document step skips the whole slug before it makes a single network call, because the engine has never written a documents list."],cells:[{label:"Two traps waiting for the first YES",paths:[],blocks:[],notes:["Said carefully. What was checked on disk is that the fixture holds zero rows for this slug, and the archives hold zero YES. The shared table was not queried for this page. The claim here is the consequence, not a database reading: with an empty fixture there is nothing for the publisher to send."],tables:[[{header:!1,cells:["The id collides in the shared table too",'Rows are keyed on portal plus source_bid_id, and source_bid_id is the same collision-prone bid_id. Two New Orleans bids both keyed "Chief Administrative Office" would land on the same row and one would overwrite the other.']},{header:!1,cells:["Cross-portal duplicates are real here","New Orleans and Fort Lauderdale post to other boards too. Grouping is the first stage that could notice. Nothing before it knows."]},{header:!1,cells:["Documents","Never captured. The engine stamps documents_gated: true on every row instead of pretending. That flag is for humans. No script downstream reads it."]},{header:!1,cells:["Contact","The list response carries none, so the engine writes an empty string. The board's contact columns for this portal would land null."]}]]}],notes:[],then:"requirements, then a second look at duplicates"},{n:"12",title:"Requirements, and the second dedup pass",who:"2.87 scripts/extract_doc_text.py → requirements-extractor → scripts/apply_requirements.py · 2.875 scripts/llm_dedup_candidates.py",summary:["Text is pulled out of every captured document, a pack is built per grouped bid, and an agent reads the pack and writes down what the bid actually demands, quoting the source word for word. A group with no material at all gets a neutral no material row so the board never shows something as forever pending.","Then duplicates are checked a second time, because enrichment has by now filled in blank buyers and dates, which changes which pairs can be compared at all."],cells:[{label:"What this portal supplies, and what it gets back",paths:[],blocks:[],notes:[],tables:[[{header:!1,cells:["Documents supplied","None, on any date. Requirements extraction has no material to read."]},{header:!1,cells:["Page text supplied","None. This engine never sets a page-text field, so the page-text publisher has nothing to store either."]},{header:!1,cells:["Gap reason recorded",'Generic. The slug has no entry in the known-walls table, so the gap script falls through to a "not yet diagnosed" reason. The wall is diagnosed. It is just not written down where that script looks.']},{header:!1,cells:["Second dedup pass","Nothing enriches this portal, so its evidence barely changes between the two passes."]}]]}],notes:[],then:"what changed, who gets told, did the run finish"},{n:"13",title:"Watch, emails, and the run check",who:"2.88 scripts/watch_list_signals.py · scripts/bid_watch.py --send · scripts/new_bids_email.py --send · scripts/pipeline_sentinel.py",summary:["Today's snapshot is diffed against the last one for change markers, the operator is emailed what is new and what is due soon, and the sentinel checks that every portal actually finished every phase.","Watch mode for this portal is none. The richer re-capture watcher runs for three other portals only. And the emails are a silent no-op across the whole system until the mail key is set in data/auth/resend.env."],cells:[{label:"The sentinel row for this portal, from data/portals/sentinel.json",paths:[],blocks:[`{
 "slug": "infor-cloudsuite-ports",
 "batch": "portals",
 "status": "GREEN",
 "issues": [],
 "last_archive": "2026-07-28",
 "surfaced": 0
}`],notes:[],tables:[]},{label:"What green means and does not mean",paths:[],blocks:[],notes:["Green means every phase ran and wrote its file. It is telling the truth about that. It says nothing about the three bids that were never triaged, because from the pipeline's point of view they were carryover and carryover is normal.","surfaced: 0 is also true, and it has been true on all 8 archive days."],tables:[]}],notes:[],then:"what the operator ends up looking at"},{n:"14",title:"The operator surfaces",who:"2.89 scripts/build_bidpack.py · 2.9 scripts/build_portal_metrics.py · 2.95 scripts/build_portals_overview.py · scripts/scorecard.py",summary:["Per-bid markdown packs, the portal-by-day monitor board, the overview page with every report inline, and the running scorecard. This portal appears on all of them as a run-status row and nothing more."],cells:[{label:null,paths:[],blocks:[],notes:[],tables:[[{header:!0,cells:["Surface","What this portal shows"]},{header:!1,cells:["Bid packs","None. Packs are built per grouped bid and this portal has published none. A future YES would give a summary page only, with no page text and no documents."]},{header:!1,cells:["Monitor board","Counts appear. But the slug is missing from the board's state table, so it shows a blank state and is marked not-core. Defensible, since it really is two states, but it means two cities inside the LGS footprint never count as core there."]},{header:!1,cells:["Activity matrix","The slug is missing from the label table, so the name falls back to Infor Cloudsuite Ports instead of the registry label. Cosmetic. Not an exclusion."]},{header:!1,cells:["Overview page","Report renders inline, with the blank source link from the empty endpoint."]},{header:!1,cells:["Scorecard","Reads the shared table, not these files. It is the only source of truth for how many YES exist. For this portal that number is zero."]}]]}],notes:[],then:null}],d=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["New Orleans puts a department name where the bid id goes","The worst one. 23 pulled rows carried 20 ids on 28 July. Three bids inherited another bid's decision, and two of those had arrived since the last run, one of them the day before. Every future bid from those departments will inherit the same stale answer. Confirmed by counting bids/all-bids.json by hand."]},{header:!1,cells:["Coral Gables and Fort Lauderdale are fine, only New Orleans is not","Coral Gables puts a real solicitation number in the reference field (IFB 2026-024) and Fort Lauderdale leaves it blank, so it falls back to a stable host-and-number id. One tenant's data habit breaks the key for the whole portal."]},{header:!1,cells:["The description is built, not scraped","Every bid is judged on its title plus one metadata line joined from whichever of type, category, sub-category, reference, currency and bid-bond note are not blank. There is no enrich_details on this engine, so it never gets richer. The judge names this in its own reasoning."]},{header:!1,cells:["No per-bid link exists on this platform","Clicking an event opens a panel inside the app, not a new address. detail_url is the city's event list page, identical for every bid of that city. Documented, not silent."]},{header:!1,cells:["No documents, no contact, ever","The public list carries neither. The engine stamps documents_gated: true and an empty contact string rather than faking them. No downstream script reads that flag."]},{header:!1,cells:["The wall is real but not written down where it counts",'The slug has no entry in the known-walls table, so the gap publisher records a generic "not yet diagnosed" reason for the missing documents and contact.']},{header:!1,cells:["stats.endpoint is empty","Compile reads a config key called entity_url; this config uses tenants. The report header and the overview page both show a blank source link. The endpoint string is sitting in bids/index.json, unread."]},{header:!1,cells:["Only YES publishes","Both of this portal's live scores are maybes, at 58 and 45. Neither becomes a board card. Zero YES across all 8 archive days means zero cards, zero packs, zero shared-table rows."]},{header:!1,cells:["Batch membership is stated twice and disagrees","The portals skill lists Batch I as four slugs at line 40, without this portal, and as five at line 187, with it. The dispatch block at 187 is what the orchestrator reads, so the run happens. Nothing keeps them in step."]},{header:!1,cells:["The runbook is a stub","data/infor-cloudsuite-ports/PORTAL.md is an auto-generated draft from 14 July whose Pull, Field map and Documents sections are all still TODO. Its health block is dated 14 July and says last swept 13 July. Nothing in it was ever checked against the live site."]},{header:!1,cells:["The stage model doc is stale","docs/portal-dataflow/infor-cloudsuite-ports.md quotes the 23 July run throughout: 21 in snapshot, 5 new, 16 carryover, 1 OPEN and 19 SKIP, 0 rows in both judge files. The 28 July files on disk say 23, 2, 21, 2 OPEN and 18 SKIP, 1 judged row. The stage list is right. The numbers are not. Files win."]},{header:!1,cells:["A closing bid loses its score","The in-engine carry-forward filters verdicts to bids still in tonight's snapshot. The shared script this portal skips would have kept them with a flag. Deliberate, but it costs history."]},{header:!1,cells:["An older Infor generation looks the same and is not","Hosts on *.cloud.infor.com using the endpoint without Xi, such as Savannah GA, are a different shape. Adding one to the tenants list would just log an error and skip."]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk. Every count traces to daily/2026-07-28/stats.json, to a row count, or to a byte size on disk. The duplicate-id counts were produced by counting bids/all-bids.json and runs/triage-carryover.json directly. The shared database was not queried for this page, and nothing here claims a row count from it. Baseline map: docs/portal-dataflow/infor-cloudsuite-ports.md, evidence-cited to file and line, and stale on numbers as noted above."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk. Every count traces to daily/2026-07-28/stats.json, to a row count, or to a byte size on disk. The duplicate-id counts were produced by counting bids/all-bids.json and runs/triage-carryover.json directly. The shared database was not queried for this page, and nothing here claims a row count from it. Baseline map: docs/portal-dataflow/infor-cloudsuite-ports.md, evidence-cited to file and line, and stale on numbers as noted above.",c="docs/portal-dataflow/pedia-infor-cloudsuite-ports.html",u={slug:e,title:t,eyebrow:s,headline:a,lede:n,funnel:r,funnel_note:o,legend:i,stages:l,sections:d,footer:h,source_page:c};export{u as default,s as eyebrow,h as footer,r as funnel,o as funnel_note,a as headline,n as lede,i as legend,d as sections,e as slug,c as source_page,l as stages,t as title};
