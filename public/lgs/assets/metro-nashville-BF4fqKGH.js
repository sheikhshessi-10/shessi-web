const e="metro-nashville",t="Metro Nashville: what happens to a bid, stage by stage",s="Portal pedia · 25",a="Metro Nashville: a board with no links, where the whole scope is a PDF",n="Nashville posts its bids on an Oracle Fusion page that has no link to any single bid and no scope text at all. A headless browser has to open each bid's pop-up and download the negotiation PDF. Every stage below is shown with a real record from the files on disk. All of it is from the run of 28 July 2026.",i=[{value:"8",label:"in snapshot"},{value:"6",label:"carried over"},{value:"2",label:"new tonight"},{value:"1",label:"triage says open"},{value:"7",label:"triage says skip"},{value:"1",label:"yes"}],o=`Every number above is copied from data/metro-nashville/daily/2026-07-28/stats.json (513 bytes). Read the "1 open" carefully. That count is the merged archive total, 6 carried plus 2 new. The AI read exactly two titles that night, GG000093 and GG000078-2, and both came back SKIP. The single OPEN is GG000077's decision copied forward from an earlier day. Nothing new survived. The one YES is an old bid the city amended.`,r=["Bid A · GG000090 · Bridges and Culverts. SKIP. Decision carried, not made tonight.","Bid B · GG000077 · Emergency Debris Removal. Re-judged tonight, YES at 94."],d=[{n:"0",title:"Is this portal even due today?",who:"scripts/portal_due.py --batch portals",summary:["This board is polled every 3 days, not nightly. The gate looks at the newest dated folder under data/metro-nashville/daily/. If it is 3 or more days old, the slug is printed and the sweep runs. Otherwise nothing happens.","Seven day folders exist in total. The one before this run was 2026-07-23, five days back, so the gate opened."],cells:[{label:"In",paths:[{path:"data/portals/registry.json",size:"cadence_days: 3"},{path:"data/metro-nashville/daily/",size:"7 dated folders"}],blocks:[],notes:["The cadence is read from Supabase first and falls back to registry.json without saying so. Evidence: scripts/portal_registry.py:56, :61."],tables:[]},{label:"The registry row for this portal (real, from registry.json)",paths:[],blocks:[`{
 "slug": "metro-nashville",
 "label": "Metro Nashville & Davidson County",
 "engine": "oracle_fusion",
 "batch": "portals",
 "cadence_days": 3,
 "authed": false,
 "enrich_passes": [],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:['Hold on to carry_forward: "engine-internal". It decides what stage 10 does.'],tables:[]}],notes:[],then:"the slug printed as DUE, so one child agent picks it up"},{n:"1",title:"One agent owns the whole sweep",who:"Agent(general-purpose) → .claude/skills/metro-nashville-sweep/SKILL.md",summary:["The portal sits in Batch J with rogers-county-ok and scbo. A single child agent runs every stage from the pull to the archive.","The orchestrator does not trust the child's write-up. It reads the files on disk afterwards and counts them itself."],cells:[{label:"In",paths:[{path:".claude/skills/metro-nashville-sweep/SKILL.md",size:"the runbook the child follows"}],blocks:[],notes:[],tables:[]},{label:"Out",paths:[{path:"a child process running pull → prep → re-enrich → triage → judge → compile",size:null}],blocks:[],notes:["Tennessee is a core LGS state, and the sweep skill says so, so a YES here is never flagged as out of area."],tables:[]}],notes:[],then:"a real browser opens the city's board"},{n:"2",title:"Pull the list",who:"run_daily.py → ps.pull → engines/oracle_fusion.py",summary:["A plain web request to this address gets nothing back but a loading shell, so the engine drives a headless Chromium: open the board, expand the filter panel, set Status to Active, search, then scroll the grid and read every row by column position.","If any row comes back as something other than Active, the pull stops with an error rather than carry on. A slow page refresh would otherwise hand back the default view, which mixes Active, Amended and Closed, and closed bids would be swallowed as open.","The list carries no scope at all. Title, buyer, dates, type, status. That is the whole row."],cells:[{label:"In → Out",paths:[{path:"ibqhjb.fa.ocs.oraclecloud.com/fscmUI/faces/NegotiationAbstracts?prcBuId=300000006739049",size:"the live board"},{path:"bids/all-bids.json",size:"26,909 bytes · 8 rows"},{path:"bids/index.json",size:"391 bytes"}],blocks:[`{
 "generated_at": "2026-07-28T22:17:13.644443+00:00",
 "snapshot_total": 8,
 "slug": "metro-nashville",
 "engine": "oracle_fusion",
 "entity_url": "https://ibqhjb.fa.ocs.
 oraclecloud.com/fscmUI/faces/
 NegotiationAbstracts?prcBuId=300000006739049",
 "state": "TN",
 "pulled_on": "2026-07-28",
 "status_filter": "Active",
 "amended": ["GG000077", "GG000090"]
}`],notes:[],tables:[]},{label:"Real record Bid A",paths:[],blocks:[`{
 "bid_id": "GG000090",
 "negotiation_number": "GG000090,3",
 "revision": "3",
 "title": "Construction, Maintenance, and
 Repairs of Bridges and Culverts",
 "buyer": "Metro Nashville & Davidson County",
 "state": "TN",
 "due_date": "2026-07-31",
 "due_time": "2:00 PM",
 "posted_date": "2026-07-28",
 "negotiation_type": "RFQ",
 "portal_status": "Active",
 "description": "",
 "source_url": "https://ibqhjb.fa.ocs.
 oraclecloud.com/fscmUI/faces/
 NegotiationAbstracts?prcBuId=300000006739049",
 "detail_url": "…same board URL…",
 "source_url_note": "Oracle Fusion ADF exposes no
 per-negotiation URL (the Details control is an
 in-page popup); this is the agency's BU-scoped
 abstracts board — find the bid by its
 Negotiation number.",
 "_detail_ok": false,
 "_amended_from": "GG000090,2"
}`],notes:["Empty description. source_url and detail_url are the same board address for every bid, and every record carries the note explaining why."],tables:[]}],notes:[`The id trick that holds this portal together. The board shows GG000090,3. The engine splits on the comma: the bid is GG000090, revision 3. A dash is left alone, which is why GG000078-2 stays whole and is not chopped. Without this, every amendment would mint a brand new bid, throw away the operator's decision and force a fresh judge call. It also means an amendment is never "new", which is exactly why the next two stages exist.`],then:"today's ids are compared against the last archive"},{n:"3",title:"Who is actually new?",who:"run_daily.py → ps.prep",summary:["Today's 8 bid ids are checked against the newest archived triage.json, which was 2026-07-23. A bid seen before keeps its old OPEN or SKIP answer as carryover. Only genuinely unseen ids go to the AI.","6 carried, 2 new. Neither of the two bids we are following is new. Bid A carried its SKIP. Bid B carried its OPEN."],cells:[{label:"Out · the two files that split the board",paths:[{path:"runs/triage-input.json",size:"425 bytes · 2 rows"},{path:"runs/triage-carryover.json",size:"688 bytes · 6 rows"},{path:"runs/judge-input.json",size:"5,027 bytes · 8 rows"},{path:"runs/_funnel.json",size:"149 bytes"}],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 8,
 "carryover_count": 6,
 "triage_input_count": 2,
 "prior_archive_ids_compared_against": 8
}`],notes:[],tables:[]},{label:"triage-input.json · the whole file, the only two bids the AI will read",paths:[],blocks:[`[
 {
 "idx": 1,
 "bid_id": "GG000093",
 "title": "Water Infrastructure Rehab and Repair",
 "buyer": "Metro Nashville & Davidson County",
 "state": "TN",
 "due_date": "2026-08-06"
 },
 {
 "idx": 2,
 "bid_id": "GG000078-2",
 "title": "Fairgrounds Ticketing Services Platform",
 "buyer": "Metro Nashville & Davidson County",
 "state": "TN",
 "due_date": "2026-08-12"
 }
]`,`{
 "bid_id": "GG000090",
 "decision": "SKIP",
 "reason": "bridge/culvert heavy civil construction"
}`,`{
 "bid_id": "GG000077",
 "decision": "OPEN",
 "reason": "Cat 1 emergency disaster debris removal"
}`],notes:[],tables:[]}],notes:[`judge-input.json is 5,027 bytes for 8 bids, and that is the point. It is built here, before anything has been downloaded. Bid B's entry in it ends at the words "RFP body (truncated to 6KB):\\n" with nothing after them. There is no scope on this board yet. Compare that with stage 7.`],then:"the amended bids have had their old scope thrown away, so go get it again"},{n:"4",title:"Repair the amended bids (this stage exists nowhere else)",who:"data/metro-nashville/scripts/run_daily.py:47-50 → ps.enrich_opens(stale)",summary:['When the pull sees a bid whose revision number changed, it wipes the flag that says "we have the detail", and the snapshot writer refuses to copy the old scope and old PDF onto the new revision. So right after the diff, those bids have nothing.','This step finds carryover bids that were triaged OPEN but now have no detail, and re-opens the board just for them. It runs before the "no new bids, stop here" exit, so it happens even on a quiet night.',"Tonight it fired on one bid: GG000077, freshly amended to revision 3. It clicked the Details pop-up, read the contact block, downloaded the new negotiation PDF and pulled its text out."],cells:[{label:"In → Out",paths:[{path:"runs/triage-carryover.json",size:"OPEN rows"},{path:"bids/all-bids.json",size:"rows where _detail_ok is false"},{path:"docs/GG000077_3_SUPPLIER.pdf",size:"98,682 bytes"},{path:"bids/all-bids.json",size:"description, contact_*, documents[], page_text written back"}],blocks:[],notes:["Two solicitations, five files. Each amendment adds another one. The model doc still says four files, written when revision 3 did not exist yet."],tables:[[{header:!0,cells:["File","Bytes"]},{header:!1,cells:["GG000077_1_SUPPLIER.pdf","100,487"]},{header:!1,cells:["GG000077_2_SUPPLIER.pdf","98,617"]},{header:!1,cells:["GG000077_3_SUPPLIER.pdf","98,682"]},{header:!1,cells:["GG000082_2_SUPPLIER.pdf","78,482"]},{header:!1,cells:["GG000082_3_SUPPLIER.pdf","78,783"]}]]},{label:"Real record after the repair Bid B",paths:[],blocks:[`{
 "bid_id": "GG000077",
 "negotiation_number": "GG000077,3",
 "revision": "3",
 "title": "Emergency Debris Removal Services",
 "due_date": "2026-08-06",
 "due_time": "2:00 PM",
 "posted_date": "2026-07-23",
 "portal_status": "Active",
 "description": "Title Emergency Debris Removal
 Services … Amendment Description This
 amendment will update the Scope Details, Cost
 Spreadsheet, Timeline, add Online Discussion
 Questions and Answers, and extend the Closing
 Date. … The Contractor shall be capable of
 managing a large workforce and multiple
 subcontractors; funding operations prior to
 initial and interim payments; and providing
 all required bonds and insurance…",
 "_detail_ok": true,
 "_amended_from": "GG000077,2",
 "contact_name": "Daniel A Drumwright",
 "contact_email": "Daniel.Drumwright2@nashville.gov",
 "contact_phone": "1-615-862-6632",
 "documents": [
 {
 "file_name": "GG000077_3_SUPPLIER.pdf",
 "file_path": "data/metro-nashville/docs/
 GG000077_3_SUPPLIER.pdf",
 "file_description": "Negotiation PDF (full
 solicitation packet)"
 }
 ]
}`],notes:['The description is 9,000 characters. It was 0 one stage earlier. The phone number is read only from the "Submit your response to the following contact" block, because a whole-document search finds the vendor help desk instead.'],tables:[]}],notes:["The cost of this stage. It opens a second headless browser and drives the Active filter all over again. On a night with an amended open bid, the board is loaded twice. Whether that is acceptable or should be folded into the first session is an open operator question."],then:"the two new titles go to the AI"},{n:"5",title:"Pass 1: open it or drop it",who:"max-triage · AI → runs/triage-verdicts.json",summary:["The AI gets a title, a buyer, a state and a due date. Nothing else exists to send. No keyword filter runs first. The default answer is SKIP, but a hauling or disposal title is opened anyway so that Pass 2 can read the PDF before deciding.","This is a general city board. Golf merchandise, doula services, police software. The slice that matters to LGS is small, and tonight it was empty."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"2 rows"},{path:"runs/triage-verdicts.json",size:"253 bytes · 2 rows"}],blocks:[],notes:["No script writes this file. An agent does. A missed row would be a silent hole, so the dispatch prompt tells the child to check that every input row came back and to run it again if not."],tables:[]},{label:"triage-verdicts.json · the whole file, both rows SKIP",paths:[],blocks:[`[
 {
 "bid_id": "GG000093",
 "idx": 1,
 "decision": "SKIP",
 "reason": "water main, wrong vertical"
 },
 {
 "bid_id": "GG000078-2",
 "idx": 2,
 "decision": "SKIP",
 "reason": "ticketing SaaS, wrong vertical"
 }
]`],notes:["Bid A is not in this file. Its SKIP was decided on an earlier run and only copied forward tonight. Two titles read, two rejected, and the night's new intake is finished."],tables:[]}],notes:[],then:"normally the new OPENs get a browser here. Tonight there were none"},{n:"6",title:"Fetch the scope for the new OPENs, and nothing to fetch",who:"ps.enrich_opens(PORTAL, config, open_ids) · ran empty",summary:["This is the stage that would normally do the heavy work: find each newly opened bid's row, click Details, read the pop-up, click every Download link, save the PDFs and pull their text out as the bid's description.","It produced nothing tonight, and that is a fact worth stating. Both new bids were SKIP, so the set of new OPENs was empty. The only detail fetch that happened on 28 July was the amendment repair one stage earlier, and the PDF it saved was already sitting on disk before triage-verdicts.json existed at all. Same code, different trigger."],cells:[{label:"What it reads when it does run",paths:[{path:"runs/triage-verdicts.json",size:"the OPEN rows · none tonight"},{path:"the board, after clicking a row's Details link",size:null},{path:"the Download link inside the pop-up",size:"a binary PDF"}],blocks:[],notes:[],tables:[]},{label:"Ways this stage gives up quietly, all by design",paths:[],blocks:[],notes:["The PDF is the scope on this portal. A bid that is never triaged OPEN therefore never gets a description at all, ever."],tables:[[{header:!1,cells:["PDF reader library missing","a warning is logged and the description stays empty, so a missing library never looks like a text-free PDF"]},{header:!1,cells:["a download fails","logged for that bid, the loop carries on"]},{header:!1,cells:["a row is not found in the grid",'logged as "row not found" and skipped']}]]}],notes:[],then:"so who still needs a verdict?"},{n:"7",title:"The re-judge trigger: the most interesting thing that happened tonight",who:"ps.build_judge_input_open → open folders/_lib/platform_sweep.py:253-300",summary:["This stage picks the bids that go to Pass 2. Three groups: bids opened tonight, bids opened on an earlier day that were never judged, and now a third group that the model doc for this portal says does not exist.","Bids already judged whose material changed since the last run. The code compares the last archived snapshot with today's and re-queues on three triggers: the closing date moved later and the bid is still open, a real scope arrived where there was none, or the portal published a new revision. It is capped at 25 bids, because a whole board re-queueing at once is a bug rather than a busy night.","Bid B hit the first trigger. It had a standing YES at 92 from 23 July, written against a bid that was closing that same day. Revision 3 moved the close out to 6 August. The verdict was about a bid that no longer existed, so it was sent back."],cells:[{label:"The two values the trigger compared",paths:[],blocks:[`daily/2026-07-23/new-bids.json
{
 "bid_id": "GG000077",
 "negotiation_number": "GG000077,2",
 "due_date": "2026-07-23"
}

daily/2026-07-28/new-bids.json
{
 "bid_id": "GG000077",
 "negotiation_number": "GG000077,3",
 "due_date": "2026-08-06"
}`],notes:["The yardstick is the last run's archive, not the snapshot the verdict was written against. That is one file to read, and it is the version that provably stops: whatever fires today is in today's archive tomorrow, so each change fires exactly once instead of every night forever. The trade is that a change from before this code shipped is not caught going backwards.","Those two dates are the whole trigger. The comparison lives at open folders/_lib/platform_sweep.py:214-216. The reason sentence it builds is printed to the run log only. Nothing writes it to a file, so it is not shown here as a record."],tables:[]},{label:"Out · the same bid, before and after the repair",paths:[{path:"runs/judge-input.json",size:"5,027 bytes · 8 rows · built at stage 3"},{path:"runs/judge-input-open.json",size:"9,843 bytes · 1 row · rebuilt after stage 4"}],blocks:[`{
 "idx": 3,
 "bid_id": "GG000077",
 "title": "Emergency Debris Removal Services",
 "description_full": "Title: Emergency Debris Removal
 Services\\nBuyer: Metro Nashville & Davidson
 County\\nState: TN\\nCloses: 2026-08-06\\n
 Source URL: https://ibqhjb.fa.ocs.oraclecloud.
 com/…\\n\\nRFP body (truncated to 6KB):\\n"
}`,`{
 "idx": 3,
 "bid_id": "GG000077",
 "title": "Emergency Debris Removal Services",
 "buyer": "Metro Nashville & Davidson County",
 "state": "TN",
 "due_date": "2026-08-06",
 "description_full": "Title: Emergency Debris Removal
 Services\\n…\\n\\nRFP body:\\nTitle Emergency Debris
 Removal Services\\nPreview Date Open Date
 7/23/2026 11:45 AM\\n…\\n2.6Section 6. Scope
 Summary\\n1.The Metropolitan Government of
 Nashville and Davidson County (Metro) is
 soliciting proposals from qualified contractors
 to operate emergency debris removal services
 within Metro Nashville-Davidson County…"
}`],notes:["The body ends there. Nothing follows the colon.","8 rows in 5,027 bytes, against 1 row in 9,843 bytes. That size flip is the entire argument for stage 4."],tables:[]}],notes:[`The model doc is out of date here, and says the opposite. docs/portal-dataflow/metro-nashville.md says under Known walls that on an amendment "the scope and PDF are refreshed but the verdict is not revisited", and asks under Open questions: "Should an entry in index.json's amended[] force a re-judge? Nothing in the code does today." The code does now, at open folders/_lib/platform_sweep.py:167-250, and its own comment names GG000077 as the case that prompted it. The files win. Treat that part of the model as stale.`],then:"one bid, one judge call"},{n:"8",title:"Pass 2: read the packet and score it",who:"max-bid-judge · AI → runs/judge-verdicts.json",summary:["The AI reads the negotiation PDF text and answers yes, maybe or no, with a score out of 100 and a reason. One bid went in. One verdict came out.","The new answer is 94, up from 92, and the reasoning cites the amendment by name. That is the re-judge trigger paying for itself: the operator sees a verdict about revision 3, not about a bid that closed on 23 July."],cells:[{label:"In → Out",paths:[{path:"runs/judge-input-open.json",size:"1 row"},{path:"runs/judge-verdicts.json",size:"1,853 bytes · 1 row"}],blocks:[],notes:["Two verdict shapes exist in the history of this repo. One writes would_lgs_bid and score, the other writes verdict and lgs_score. The compile step normalizes both at the moment it writes, which is why the record on the right carries all four keys with matching values."],tables:[]},{label:"Real record Bid B · YES, 94",paths:[],blocks:[`{
 "bid_id": "GG000077",
 "idx": 3,
 "verdict": "yes",
 "would_lgs_bid": "yes",
 "lgs_score": 94,
 "score": 94,
 "reasoning": "Metro Nashville is soliciting an
 IDIQ contingency contract for emergency debris
 removal under its Debris Management Plan -
 removal, processing and lawful disposal of
 disaster-generated debris from public property
 and rights-of-way, plus establishing and
 operating TDSR sites in Davidson County after
 tornadoes or severe storms. This is Category 1
 pre-positioned disaster debris standby, the
 heart of LGS's win column, from a county/city
 buyer in a core state. … The 7/23 amendment
 revised the Scope Details, Cost Spreadsheet and
 Timeline and moved the close to 8/6, so bid the
 rev-3 packet.",
 "red_flags": [
 "amended_rev3_pull_updated_scope_and_
 cost_spreadsheet",
 "idiq_no_guaranteed_spend_until_activated"
 ]
}`],notes:[],tables:[]}],notes:[],then:"the night is written down"},{n:"9",title:"Write today's folder",who:"ps.compile_archive(PORTAL, config)",summary:["Carryover decisions are merged with tonight's, yesterday's live verdicts are merged with tonight's, the funnel is counted, and the day folder is written plus one row in the archive index. Re-running the same date replaces it rather than doubling it.","One rule here bites this portal harder than most. A verdict whose bid is no longer in the Active list is dropped. On this board a bid leaves Active the moment it is superseded or closed, so verdicts age out fast."],cells:[{label:"Out · data/metro-nashville/daily/2026-07-28/",paths:[],blocks:[`| date | snapshot | new | open | yes | maybe | no |
| 2026-07-28 | 8 | 2 | 1 | 1 | 0 | 0 |
| 2026-07-23 | 8 | 0 | 2 | 1 | 0 | 1 |
| 2026-07-20 | 10 | 0 | 2 | 1 | 0 | 1 |`],notes:[],tables:[[{header:!0,cells:["File","Holds","Bytes"]},{header:!1,cells:["new-bids.json","8 rows, the whole snapshot","26,909"]},{header:!1,cells:["triage.json","8 decisions, tomorrow's memory","938"]},{header:!1,cells:["verdicts.json","1 row","1,882"]},{header:!1,cells:["stats.json","the funnel counts","513"]},{header:!1,cells:["report.md","human summary","1,019"]}]]},{label:"The drop, shown with a real bid",paths:[],blocks:[`{
 "bid_id": "GG000082",
 "title": "Transfer, Hauling & Disposal Services",
 "would_lgs_bid": "no",
 "score": 12,
 "primary_reason": "Despite the 'hauling &
 disposal' title, the PDF synopsis is routine
 MSW: operate a transfer station and haul/dispose
 household garbage for the Dept of Waste Services
 (164k households). Waste-management vertical,
 not disaster debris."
}`],notes:["On 23 July the archive held two verdicts. Tonight it holds one. This is the one that vanished, and it is not a bug:","GG000082 is absent from all 8 rows of tonight's snapshot, so its NO was filtered out at open folders/_lib/platform_sweep.py:400. Its two PDFs are still on disk. The verdict is gone from the ledger."],tables:[]}],notes:[],then:"the portal's own work is done. the shared machinery takes over"},{n:"10",title:"Carry forward: this portal is not in it, on purpose",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:[`Across the estate there is a safety net that rescues verdicts for bids that fell out of one night's pull. --all resolves to the portals whose registry entry says carry_forward: "orchestrator". This one says "engine-internal", so nothing runs for it. Running it as well would apply the same merge twice.`,"The real carry-forward already happened inside the sweep: triage decisions at stage 3, verdicts at stage 9. Nothing is missing."],cells:[{label:"Proof it did not run",paths:[{path:"data/metro-nashville/daily/*/_carryforward_audit.json",size:"no such file in any day folder"}],blocks:[],notes:["The two mechanisms are not the same, and the difference matters here. The orchestrator script keeps a verdict whose bid left the snapshot and stamps it as not-in-today. The in-sweep merge drops it, which is what happened to GG000082 at stage 9. On a board where amendments push bids in and out of Active, the in-sweep behaviour is the stricter of the two. The model doc predicted this, and the files confirm it."],tables:[]}],notes:[],then:"the YES is copied into the ledger, the report and the board fixture"},{n:"11",title:"Ledger, report, board card",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared steps in a row. The all-time YES ledger is rebuilt from every day folder of every portal. The compact report written at stage 9 is thrown away and re-rendered in the shared layout so every portal reads the same. Then every bid ever judged YES is flattened into one card for the board.","Only YES publishes. A MAYBE from this portal would stay off the board. There were none tonight anyway."],cells:[{label:"Out",paths:[{path:"data/portals/cumulative-yes.json",size:"1 metro-nashville row"},{path:"daily/2026-07-28/report.md",size:"1,019 bytes · rewritten"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"1,470 cards · 1 metro-nashville"}],blocks:[`- Snapshot: **8** open bids
- Carryover: 6 · NEW today: 2
- Triage: 1 OPEN / 7 SKIP
- Scored: **1 YES / 0 MAYBE / 0 NO**

## YES — Max would bid
- **[94] Emergency Debris Removal Services** —
 Metro Nashville & Davidson County ·
 closes 2026-08-06`],notes:["The link printed under that line is the board address, not the bid. There is no bid address to print."],tables:[]},{label:"The board card Bid B",paths:[],blocks:[`{
 "id": "bdc903422c2490a6",
 "portal": "metro-nashville",
 "portal_label": "Metro Nashville & Davidson County",
 "source_bid_id": "GG000077",
 "title": "Emergency Debris Removal Services",
 "buyer": "Metro Nashville & Davidson County",
 "state": "TN",
 "solicitation_no": null,
 "federal": false,
 "score": 94,
 "verdict": "yes",
 "category": "",
 "due_date": "2026-08-06",
 "contact_name": "Daniel A Drumwright",
 "contact_email": "Daniel.Drumwright2@nashville.gov",
 "contact_phone": "1-615-862-6632",
 "fit_signals": [],
 "first_seen": "2026-07-11",
 "last_seen": "2026-07-28",
 "has_documents": true
}`],notes:["One card out of 1,470. first_seen 11 July, last_seen 28 July. Seventeen days on the same stable id, across three revisions."],tables:[]}],notes:[],then:"the bid stops being Nashville-shaped"},{n:"12",title:"Onto the shared board, and into a cluster",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["Every YES card is pushed into one shared bids table keyed on portal plus source bid id. Because the id survives amendments, the row is updated in place rather than deleted and re-created. Then bids from every portal are grouped by normalized title and state into clusters, so one solicitation seen in two places becomes one thing to decide.","Bid B is clustered. And its cluster is not Nashville-only."],cells:[{label:"In → Out",paths:[{path:"PortalPro/src/fixtures/portal-bids.json",size:"the card above"},{path:"daily/2026-07-28/stats.json",size:"one sweep_runs row"},{path:"supabase.bids + supabase.clusters",size:"upsert, then union-find"}],blocks:[],notes:["One brake to know about. A merge is blocked when both bids carry a due date and the dates differ. Nashville amendments move closing dates, so an amended bid can drift out of range of a twin it used to match."],tables:[]},{label:"The cluster on disk, from the bid pack's header block",paths:[],blocks:[`data/bidpacks/tn-metro-nashville-davidson-county-
emergency-debris-removal-services-1d9853/BID.md
---
pack_key: tn-metro-nashville-davidson-county-
 emergency-debris-removal-services-1d9853
state: TN
verdict: yes
cluster_id: b5c036d0-942c-4709-b798-3248c55c967c
score: 96
due_date: 2026-07-14
---

# Emergency Debris Removal Services
**Portal:** bidnet
**Solicitation #:** 444073417399
**Decided by:** Sean Hunt
**Decision:** accepted`],notes:["Same solicitation, found twice. The cluster's header row is the BidNet twin, score 96, due 2026-07-14. The city's own board says the close is 2026-08-06 after revision 3. Both numbers are real and they disagree. Which row wins the header is a selection rule this page did not read, so this is a mismatch, not a diagnosis. Stage 13 shows the requirements extractor writing the same complaint down by itself."],tables:[]}],notes:[],then:"the PDFs are uploaded and read"},{n:"13",title:"Documents and requirements",who:"2.85b publish_bid_documents.py · 2.85c enrichers.py · 2.87 extract_doc_text.py → requirements-extractor",summary:["This portal hands over a file path, not a web address, because the PDF arrives over a one-time session request with no stable link. There is a branch in the uploader built for exactly that case. Each PDF is read off disk, uploaded under the bid's cluster, and recorded.","The standing cross-portal backstops that fill missing descriptions and contacts have little left to do here. The registry lists no portal-specific enrichment pass, and the health snapshot in PORTAL.md records full description, contact and document coverage. Stage 4 already did that work.","Then the packet text is pulled out and an agent writes the bid's requirements, each one with a quote copied straight from the solicitation. This is a strong portal for that step, because the document is the full packet rather than a listing blurb."],cells:[{label:"Real requirements, from the pack on disk. Every > line is quoted straight out of the packet.",paths:[],blocks:[`requirements.md · Status: partial

## Bid bond confidence 0.8, kind performance
> The initial Task Order, typically issued within
 24 hours, will authorize mobilization and require
 Performance and Payment Bonds.

## Licenses confidence 0.85
> The Contractor shall maintain all required State
 of Tennessee and Metro Nashville licenses and
 permits, including business and contractor
 licenses, and provide copies to the Debris Manager.

## Pre-bid date 2026-06-30
> • 6/30/2026 - Pre-Offer Meeting

## Other requirements
### FEMA Certification form
> The attached FEMA Certification document is a
 mandatory component of this solicitation and must
 be completed signed and submitted with your
 proposal.`],notes:['The extractor caught the date mismatch by itself. Under "Other requirements" it wrote: "Amendment 2 (GG000077,2) shows Close Date 7/23/2026 2:00 PM; cluster due_date lists 7/14 (original close). Doc supersedes." It also flagged that the extracted text cuts off before the Bond, Insurance and Affidavit sections, which is why the insurance entry says the full section text was not captured.'],tables:[]},{label:"Four document renders in one pack, and the newest one is blank",paths:[],blocks:[`# GG000077_3_SUPPLIER.pdf
**Document ID:** 8cd3d75b-531c-4632-9660-f45bf9ce0606
**Kind:** documents
**Uploaded at:** 2026-07-29T10:52:39.154683+00:00

---

_No extracted text available (extraction failed
or not yet run)._`],notes:["These pack files are dated after the 28 July run, so this is the state of the shelf today rather than something that run produced. As it stands, the revision-3 packet is uploaded but its text is not readable in the pack, while revisions 1 and 2 and the original are all there in full. The requirements above were built from the older revisions."],tables:[[{header:!0,cells:["Render","Date it was uploaded to the bucket","Bytes"]},{header:!1,cells:["gg000077-supplier-pdf.md","2026-06-25","78,369"]},{header:!1,cells:["gg000077-1-supplier-pdf.md","2026-07-12","78,772"]},{header:!1,cells:["gg000077-2-supplier-pdf.md","2026-07-17","77,037"]},{header:!1,cells:["gg000077-3-supplier-pdf.md","2026-07-29","223"]}]]}],notes:[],then:"now that blanks are filled, look for twins again"},{n:"14",title:"Dedup, second time round",who:"2.875 · llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["The enrichment and requirements steps fill in buyers and closing dates that were blank before. That changes which pairs of bids can even be compared, so the twin-finder runs again on just that residue.","For this portal there is a specific reason to care. A closing date quoted out of the negotiation PDF can make a Nashville bid comparable to a twin that the date brake blocked the first time round."],cells:[{label:"Out",paths:[{path:"data/portals/llm-dedup-candidates.json",size:"any pair worth a second look"}],blocks:[],notes:["If the pass finds no pairs, no judge is dispatched. This portal contributes one live bid, so it is a small contributor by volume and a real one by quality: it carries a full packet, a named contact and a phone number."],tables:[]}],notes:[],then:"what changed, who needs telling, did the run finish"},{n:"15",title:"Change watching, emails, and the health check",who:"2.88 · watch_list_signals.py · publish_page_text.py · the digests · pipeline_sentinel.py",summary:["Today's snapshot is diffed against yesterday's for list-level change markers, the page text captured at stage 4 is stored, and the operator is emailed what is new, what changed and what closes soon. Then the sentinel checks that every portal finished every phase.",'The registry says watch: "none" for this portal. Four portals are marked "v2-recipe", the full re-capture setting: bidnet, centralauctionhouse, demandstar-pro and bonfire-pro. Be careful how much you read into that field, though: outside its own description line in scripts/portal_registry.py:21 the string appears nowhere in the repo, so no script branches on it today. Either way this board does not need re-capture: its own amendment detection at stage 2 is already doing that job, and doing it better, because it acts on the revision number rather than on a text diff.'],cells:[{label:"The sentinel row for this portal, whole record",paths:[],blocks:[`{
 "slug": "metro-nashville",
 "batch": "portals",
 "status": "GREEN",
 "issues": [],
 "last_archive": "2026-07-28",
 "surfaced": 1
}`],notes:[],tables:[]},{label:"What actually reaches a human",paths:[],blocks:[],notes:[],tables:[[{header:!1,cells:["Page text stored for the bid","works, captured at stage 4"]},{header:!1,cells:["New-bid and watch digests, deadline alerts","silent until RESEND_API_KEY is set in data/auth/resend.env"]},{header:!1,cells:["Sentinel","green, one bid surfaced"]},{header:!1,cells:["Monitor board","shows this portal with a blank state and not core. See the table below."]}]]}],notes:[],then:null}],l=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["There is no link to any single bid. The Details control is a pop-up and the internal id appears nowhere in the page. Three different id parameters were tested and none of them deep-links.","Every bid's source_url and detail_url are the same board address, and every record carries a note telling the operator to find it by negotiation number."]},{header:!1,cells:["The list has no scope at all. The whole solicitation is the PDF.","A bid that is never triaged OPEN never gets a description. Pass 1 decides on a title alone, and for a SKIP that is final."]},{header:!1,cells:["The PDF has no fixed address. It arrives over a one-time session request.","Nothing can be handed to a plain downloader. The file is saved locally and a repo path is passed on instead, and the uploader has a branch built for this portal."]},{header:!1,cells:["An amendment keeps the bid id but wipes the stored detail.","Deliberate. Otherwise revision 1's scope and PDF would ride along forever while the dates moved. The price is a second full browser load on any night with an amended open bid."]},{header:!1,cells:["index.json's amended list and the _amended_from field are not the same thing.","On 28 July the index listed 2 amended ids, while 6 of the 8 records carried an _amended_from value. The index is what changed on this pull. The field is a mark left on the record whenever it last changed."]},{header:!1,cells:["A verdict is dropped when its bid leaves the Active list.","Real and visible: GG000082's NO at score 12 was in the 23 July archive and is gone from the 28 July one. Its two PDFs are still on disk."]},{header:!1,cells:["The model doc is stale on re-judging.","It says an amended bid that was already judged is never re-judged and that nothing in the code does it. The code does, and it fired on GG000077 this run, moving it 92 to 94. Treat that section of docs/portal-dataflow/metro-nashville.md as out of date."]},{header:!1,cells:["The model doc's counts are from 23 July, not 28 July.","It says 0 new, 8 carryover, 5 amended ids, 4 PDFs. The anchor run has 2 new, 6 carryover, 2 amended ids, 5 PDFs. The files win."]},{header:!1,cells:["The monitor board has this portal in the wrong place, and two files disagree about why.",'The slug is missing from PORTAL_STATE in scripts/build_portal_metrics.py:37, so the board renders its state as empty and marks it not core. The sweep skill is explicit that it should be core: "TN is a CORE LGS state. Do NOT flag YES with out_of_core_state" (.claude/skills/metro-nashville-sweep/SKILL.md:28). But CORE at scripts/build_portal_metrics.py:36 is {"MS","LA","TX","AL","AR","FL","GA","SC"} — no TN. So this is not the one-line fix the model doc calls it: adding the slug fixes the blank state only, and the not-core tag needs TN added to CORE, which also changes tennessee-cpo (already in PORTAL_STATE as TN and non-core today). Two wrong values on an operator board, and a decision to make first.']},{header:!1,cells:["No typed reason for a missing field.",'The slug has no entry in scripts/gap_reasons.py, so anything still missing falls through to the generic "not yet diagnosed".']},{header:!1,cells:["The bid pack's header row is the BidNet twin.","BID.md shows portal bidnet, score 96, due 2026-07-14, while the city's board says the close is 2026-08-06 after revision 3. Two real records, one stale-looking header."]},{header:!1,cells:["The revision-3 packet has no readable text in the pack.",'Its render says "No extracted text available", while revisions 1 and 2 and the original are all there in full. The requirements were built from the older revisions.']},{header:!1,cells:["PORTAL.md is an auto-generated draft.","Its Pull, Field map and Documents sections are all marked TODO, and its 100% coverage figures come from a July 14 health snapshot rather than a live audit."]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read off disk from the named file. Every count traces to daily/2026-07-28/stats.json, a row count, or a byte size. Baseline map: docs/portal-dataflow/metro-nashville.md, evidence-cited to file:line, and marked stale above where the files disagree with it."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read off disk from the named file. Every count traces to daily/2026-07-28/stats.json, a row count, or a byte size. Baseline map: docs/portal-dataflow/metro-nashville.md, evidence-cited to file:line, and marked stale above where the files disagree with it.",c="docs/portal-dataflow/pedia-metro-nashville.html",p={slug:e,title:t,eyebrow:s,headline:a,lede:n,funnel:i,funnel_note:o,legend:r,stages:d,sections:l,footer:h,source_page:c};export{p as default,s as eyebrow,h as footer,i as funnel,o as funnel_note,a as headline,n as lede,r as legend,l as sections,e as slug,c as source_page,d as stages,t as title};
