const e="sc-sceis",t="South Carolina SCEIS: what happens to a bid, stage by stage",s="Portal pedia · 44",a="South Carolina SCEIS: what happens to a bid, from a Struts form to the board",n="Every stage of the run, with a real record from the actual files at each step. Two bids are followed. One is a skip that was decided weeks ago, rides along for free, and stops at stage 7. One is new, goes the whole way, and ends as a YES at score 92. All data is from the run of 28 July 2026. This portal only runs every third day, so the run before it was 24 July.",o=[{value:"159",label:"in snapshot"},{value:"149",label:"carryover"},{value:"10",label:"new tonight"},{value:"4",label:"triage says open"},{value:"2",label:"yes"},{value:"1",label:"maybe"},{value:"1",label:"no"}],r="Sources: data/sc-sceis/daily/2026-07-28/stats.json (480 bytes) and data/sc-sceis/bids/all-bids.json (159 rows, 79,344 bytes). 155 of the 159 were SKIP. The four OPENs are not four new OPENs: only one bid was actually judged that night. The other three rode in from the 24 July archive, and only one of them was new on 24 July: 5400029920. 5400029971's verdict first appears in the 30 June archive and 5400028478's in the 21 June one.",i=["Bid A · 5400029982 · WEBSITE HOSTING SERVICES, Adjutant General. Skipped on 7 July, carried along ever since.","Bid B · 5400030004 · *ON CALL TREE REMOVAL GREENVILLE, SCDOT. New tonight. Ends as YES, score 92."],l=[{n:"0",title:"The cadence gate: is this portal even due?",who:"scripts/portal_due.py --batch portals",summary:["Most portals in the batch run every night. This one does not. The gate looks at the newest dated folder under data/sc-sceis/daily/, compares its age to the number in the registry, and only prints the slug when the portal is due.","Two nights out of three, nothing below this line happens at all. That is safe here because the next stage diffs against the last archive, not against yesterday. A bid posted on a quiet night is simply picked up on the next due night."],cells:[{label:"In → Out",paths:[{path:"data/sc-sceis/daily/",size:"21 dated folders when the gate looked, newest 2026-07-24"},{path:"data/portals/registry.json",size:"the row below"},{path:"the slug on stdout",size:"4 days since 07-24, cadence is 3, so it ran"}],blocks:[],notes:[],tables:[]},{label:"Real record · the registry row that governs everything",paths:[],blocks:[`{
 "slug": "sc-sceis",
 "label": "South Carolina SCEIS",
 "engine": "sc_sceis",
 "batch": "portals",
 "cadence_days": 3,
 "authed": false,
 "enrich_passes": [],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:["Four of these eleven fields decide what happens at stages 4, 8, 11 and 13. Keep them in mind."],tables:[]}],notes:[],then:"one form POST, no login, no browser"},{n:"1",title:"Pull the list of open solicitations",who:"data/sc-sceis/scripts/run_daily.py · step 1",summary:["SCEIS is an old public Struts web app. We POST its search form asking for open solicitations and read the results table straight out of the HTML. No login, no headless browser, no keyword filter.",'The table has four columns: number, description, agency, closing date. The "description" column is really the title. There is no scope text anywhere on the list page, so every row is written with description set to an empty string.'],cells:[{label:"In → Out",paths:[{path:"apps.sceis.sc.gov/SCSolicitationWeb/solicitationSearch.do",size:"the form POST"},{path:"bids/all-bids.json",size:"79,344 bytes · 159 rows"},{path:"bids/index.json",size:"289 bytes"},{path:"logs/pull_log.txt",size:"26,723 bytes, append-only across all runs"}],blocks:[`21:57:47 pull starting · today=2026-07-28
21:58:30 reported total=159 · displaytag id=49653
21:58:30 page 2: +15 (cum 30)
 …
21:58:31 page 11: +9 (cum 159)
21:58:31 wrote 159 open solicitations`],notes:["The first page took 43 seconds. The remaining ten took one second between them. Fifteen rows a page, eleven pages."],tables:[]},{label:"Real record Bid A from bids/all-bids.json",paths:[],blocks:[`{
 "bid_id": "5400029982",
 "title": "WEBSITE HOSTING SERVICES",
 "buyer": "Adjutant General",
 "agency": "Adjutant General",
 "status": "Open",
 "due_date": "2026-07-28",
 "due_date_raw": "07/28/2026 10:00:00 AM",
 "state": "SC",
 "detail_url": "https://apps.sceis.sc.gov/
 SCSolicitationWeb/contractSearch.do?
 solicitnumber=5400029982",
 "description": "",
 "_detail_ok": false
}`],notes:["This is what 158 of the 159 rows look like. Empty description, _detail_ok false. A detail_url is written for every row, and nothing ever opens it."],tables:[]}],notes:["Two guards worth knowing. If the form or the markup drifts and zero rows parse, the pull raises instead of writing an empty snapshot, so a broken night cannot wipe the memory. And the page loop is hard-capped at page 60, which at fifteen rows a page would cap the snapshot at 900 solicitations. It never got near that: the loop also stops the moment it has as many rows as the site reported, which is why it ended at page 11. Rows whose closing date cannot be read are kept, not dropped: unknown counts as open."],then:"the snapshot is compared against the last archive"},{n:"2",title:"Diff first: what is actually new",who:"data/sc-sceis/scripts/run_daily.py · step 2 (platform_sweep)",summary:["Tonight's 159 rows are matched against the last archive's decisions, from 24 July. A bid we have already ruled on becomes carryover and keeps its old decision for free. Only genuinely new solicitation numbers go to the AI.","149 carryover, 10 new. That ratio is the whole reason this portal costs almost nothing to run."],cells:[{label:"In → Out",paths:[{path:"bids/all-bids.json",size:"159 rows"},{path:"daily/2026-07-24/triage.json",size:"152 prior decisions"},{path:"runs/triage-input.json",size:"1,899 bytes · 10 rows"},{path:"runs/triage-carryover.json",size:"19,006 bytes · 149 rows"},{path:"runs/judge-input.json",size:"88,911 bytes · 159 rows"},{path:"runs/_funnel.json",size:"156 bytes"}],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 159,
 "carryover_count": 149,
 "triage_input_count": 10,
 "prior_archive_ids_compared_against": 152
}`],notes:[],tables:[]},{label:"Real record Bid A in runs/triage-carryover.json",paths:[],blocks:[`{
 "bid_id": "5400029982",
 "decision": "SKIP",
 "reason": "Website hosting IT service"
}`,`{
 "idx": 51,
 "bid_id": "5400030004",
 "title": "*ON CALL TREE REMOVAL GREENVILLE",
 "buyer": "Transportation",
 "state": "SC",
 "due_date": "2026-08-24",
 "detail_url": "https://apps.sceis.sc.gov/
 SCSolicitationWeb/contractSearch.do?
 solicitnumber=5400030004",
 "description_full": "Title: *ON CALL TREE REMOVAL
 GREENVILLE\\nBuyer: Transportation\\nState: SC\\n
 Closes: 2026-08-24\\nSource URL: …\\n\\n
 RFP body (truncated to 6KB):\\n"
}`],notes:["Three fields. No title. That decision was first written on 7 July and has been copied forward on every run since.",'Look at the end. "RFP body (truncated to 6KB):" and then nothing. Remember this record: the same bid, the same field name, looks completely different three stages from now.'],tables:[]}],notes:["judge-input.json is the biggest file this stage writes and nobody reads it. 88,911 bytes, larger than the snapshot itself, because it wraps every one of the 159 rows in a header block. Every body inside it is empty. The file the judge actually gets is built later, at stage 5, from scratch."],then:"ten titles go to the AI"},{n:"3",title:"Triage: keep it or drop it, on the title alone",who:"max-triage · AI, then the dispatching agent writes the file",summary:["Ten new bids, six fields each: index, number, title, buyer, state, closing date. There is no description to send, because there is none on disk. The AI marks each one OPEN or SKIP. The default is SKIP; OPEN needs a real LGS verb such as tree, debris, storm, clearing, mowing, demolition or drainage.","Nine SKIP, one OPEN. That single OPEN is the only bid that costs anything more tonight."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"1,899 bytes · 10 rows"},{path:"runs/triage-verdicts.json",size:"1,633 bytes · 10 rows"}],blocks:[`5400029925 SKIP commodity purchase, wrong vertical
5400030034 SKIP training/professional services
5400030041 SKIP sole-source notice, no LGS verb
5400030023 SKIP structural bridge work, not LGS
5400029451 SKIP admin/consulting support
5400030004 OPEN SCDOT on-call tree removal - core LGS vein
5400030042 SKIP equipment commodity, wrong vertical
5400030018 SKIP striping, wrong vertical
5400029946 SKIP professional services
5400029723 SKIP education consulting`],notes:[],tables:[]},{label:"Real record Bid B · opened",paths:[],blocks:[`{
 "bid_id": "5400030004",
 "title": "*ON CALL TREE REMOVAL GREENVILLE",
 "decision": "OPEN",
 "reason": "SCDOT on-call tree removal -
 core LGS vein"
}`],notes:["Bid A is not in this file at all. It was decided on 7 July. Tonight it exists only as a carryover row. Its total cost on this run is the disk space it takes up. That is the point of diffing first.","Note the shape drift: this agent wrote a title on every row. The one that ran on 7 July did not. Nothing in the code requires it. An AI types this file by hand."],tables:[]}],notes:[],then:"the enrichment step that does nothing, except this night"},{n:"4",title:"Fetch the detail pages: a step that does not exist",who:"ps.enrich_opens(PORTAL, config, open_ids) · returns 0",summary:["Every other portal fills in the scope here. This one cannot. The shared code looks for a function called enrich_details on the SCEIS engine, does not find one, and returns zero. The engine file has exactly one public function, pull. The detail page is named in the config and never opened.","So the model of this portal says, in plain words, that descriptions stay empty forever and that documents and contacts are walls we cannot pass.","The files on disk say otherwise, for exactly one row out of 159."],cells:[{label:"What the code does",paths:[{path:"enrich_opens → 0",size:"no file written, no page fetched"}],blocks:[],notes:['Who wrote it, then? Searching every Python file in the repo for the SCEIS attachment URL returns nothing. The sweep skill does not mention it either. The description text stamps itself "pulled live 2026-07-28", so it was fetched during this run, by hand, by the agent driving the sweep, outside the modeled pipeline. Nothing repeats it tomorrow. The model doc is stale here: "descriptions stay empty forever" is no longer true of this file, and the known-walls table lists documents and contact as uncaptured while this row carries both.',"Counted off disk in bids/all-bids.json after the run: 159 rows, 1 with a description, 1 with documents, 1 with a contact email, 1 with _detail_ok true. All four are the same row: Bid B."],tables:[]},{label:"Real record Bid B · the fields that appeared out of nowhere",paths:[],blocks:[`{
 "_detail_ok": true,
 "documents": [
 {
 "name": "SOLICITATION.pdf",
 "url": "https://apps.sceis.sc.gov/
 SCSolicitationWeb/attachmentDisplay.do?
 attachName=SOLICITATION&attachType=PDF&
 phioClass=BBP_P_DOC&phioObject=005056AC2E17…"
 },
 {
 "name": "ATTACHMENT D-H.pdf",
 "url": "https://apps.sceis.sc.gov/
 SCSolicitationWeb/contractSearch.do?
 solicitnumber=5400030004"
 }
 ],
 "contact_name": "Tamika Thomas",
 "contact_email": "ThomasTS@scdot.org",
 "contact_phone": "864-241-1010 ext. 6027",
 "description": "[Enriched from SOLICITATION.pdf
 pulled live 2026-07-28 from SCEIS
 attachmentDisplay.do — 53 pages]
 Issuer: SC Department of Transportation
 (SCDOT) Procurement Office, 955 Park St
 Room 101, Columbia SC 29201 …"
}`],notes:["8,526 characters of real scope text, from a 53-page PDF. The second document's URL is not a file. It is the detail page again."],tables:[]}],notes:[],then:"the judge queue is rebuilt from the snapshot, not from stage 2"},{n:"5",title:"Build the judge queue: only what still needs an answer",who:"ps.build_judge_input_open(PORTAL)",summary:["Four bids in the snapshot are marked OPEN: one from tonight, three carried over. The three older ones already carry verdicts in the 24 July archive, so they are left alone. Only Bid B goes to the judge.","This stage also rescues a specific failure: an OPEN triaged on an earlier night that somehow never got judged is picked up here instead of sitting unanswered forever."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json + runs/triage-carryover.json",size:"4 OPENs between them"},{path:"daily/2026-07-24/verdicts.json",size:"3 already answered"},{path:"bids/all-bids.json",size:"the description is re-read from here, live"},{path:"runs/judge-input-open.json",size:"9,253 bytes · 1 row"}],blocks:[],notes:["The timing accident that made this night good. Stage 2 built its judge file before the hand enrichment; this stage builds its file after. Same bid, same field name description_full: empty in judge-input.json, 8.5 KB in judge-input-open.json. Because this stage re-reads the snapshot instead of reusing stage 2's file, the enrichment reached the judge. Had it landed an hour later, it would not have."],tables:[]},{label:"Real record Bid B · the only row in the queue",paths:[],blocks:[`{
 "idx": 51,
 "bid_id": "5400030004",
 "title": "*ON CALL TREE REMOVAL GREENVILLE",
 "buyer": "Transportation",
 "state": "SC",
 "due_date": "2026-08-24",
 "description_full": "… RFP body:
 [Enriched from SOLICITATION.pdf pulled live
 2026-07-28 from SCEIS attachmentDisplay.do
 — 53 pages]
 Procurement Officer: Tamika Thomas ·
 ThomasTS@scdot.org · 864-241-1010 ext. 6027
 Solicitation type: Invitation For Bid (IFB)
 Offer due: 08/24/2026 14:30 · Questions due:
 08/07/2026 12:00 · Award posted: 09/09/2026
 Estimated contract period: 09/21/2026 –
 09/20/2029 (3 years)
 MANDATORY MINIMUM QUALIFICATION: bidder must
 document a minimum of FIVE YEARS experience
 directly related to tree removal work …
 === SECTION III — SCOPE OF WORK /
 SPECIFICATIONS (verbatim) ===
 SCDOT is soliciting for On-Call Tree Removal
 Services within or near the right-of-way
 limits on SCDOT-maintained roads and routes
 in Greenville County. …"
}`],notes:['Shortened here with … for the page. Nothing is reworded. The buyer is the bare word "Transportation". That is all the SCEIS table gives.'],tables:[]}],notes:[],then:"one bid, one score"},{n:"6",title:"Judge: yes, maybe or no, out of 100",who:"max-bid-judge · AI, then the dispatching agent writes the file",summary:["One bid in, one verdict out. Because the scope text was there, this verdict quotes the contract instead of guessing from a title. That is rare on this portal.","The judge still flags the two things an operator has to check: South Carolina is outside LGS's core states, and the bid demands five documented years of tree-removal experience plus five references."],cells:[{label:"In → Out",paths:[{path:"runs/judge-input-open.json",size:"1 row"},{path:"runs/judge-verdicts.json",size:"1,538 bytes · 1 row"}],blocks:[],notes:["Two names for every answer. This file carries both would_lgs_bid and verdict, both lgs_score and score, both primary_reason and reasoning. Agents have written two different key shapes over time, so the next stage accepts either and stores both. Any tool reading only one name will work some nights and silently read nothing on others."],tables:[]},{label:"Real record Bid B · YES, 92",paths:[],blocks:[`{
 "bid_id": "5400030004",
 "title": "*ON CALL TREE REMOVAL GREENVILLE",
 "buyer": "Transportation",
 "state": "SC",
 "due_date": "2026-08-24",
 "would_lgs_bid": "yes",
 "verdict": "yes",
 "lgs_score": 92,
 "score": 92,
 "reasoning": "Section III is verbatim LGS work:
 SCDOT wants 'On-Call Tree Removal Services
 within or near the right-of-way limits on
 SCDOT-maintained roads and routes in
 Greenville County,' covering 'cutting and
 leaving, cutting and removing, and cutting,
 removing, stump grinding, and traffic
 control.' … Clause 1.15 adds 'Emergency
 call-outs could occur at any time (day,
 night, and/or weekends),' the storm-standby
 shape LGS already wins. …",
 "primary_reason": "State DOT three-year on-call
 tree removal, stump grinding and debris
 disposal in the highway right-of-way with
 24/7 emergency call-outs - the exact
 contract shape LGS wins.",
 "red_flags": [
 "out_of_core_state",
 "mandatory_5yr_tree_removal_experience_
 plus_5_references"
 ]
}`],notes:[],tables:[]}],notes:[],then:"tonight's answers are merged with every answer still live"},{n:"7",title:"Compile the archive: this portal's own memory",who:"ps.compile_archive(PORTAL, config)",summary:["Carryover and tonight's triage are merged into one decision list. Verdicts from earlier runs are folded forward for any bid still in the snapshot. Both verdict key shapes are normalized. Five files are written into a dated folder, plus one row on the portal's index.","That merge is this portal's carry-forward. It happens inside the engine, not in the shared script. Stage 8 explains why that matters."],cells:[{label:"Out · data/sc-sceis/daily/2026-07-28/",paths:[],blocks:[`5400028478 maybe 55 _first_judged 2026-06-23
5400029971 yes 78 no _first_judged key
5400029920 no 20 no _first_judged key
5400030004 yes 92 no _first_judged key ← tonight`],notes:["Only one row carries _first_judged, and only the shared carry-forward script writes it — the one that ran here once, on 23 June (stage 8). Its own archive gives it away: that verdict is already in the 21 June folder, two days before the stamp. The other three verdicts first appear on 30 June, 24 July and tonight, and nothing dates them in the file itself."],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","159 rows, the whole snapshot, not just the new ones","79,344 B"]},{header:!1,cells:["triage.json","159 decisions, tomorrow's memory","20,636 B"]},{header:!1,cells:["verdicts.json","4 live verdicts, only 1 decided tonight","4,585 B"]},{header:!1,cells:["stats.json","the funnel counts at the top of this page","480 B"]},{header:!1,cells:["report.md","human summary (rewritten again at stage 9)","1,762 B"]}]]},{label:"Real record Bid A in daily/2026-07-28/triage.json",paths:[],blocks:[`{
 "bid_id": "5400029982",
 "decision": "SKIP",
 "reason": "Website hosting IT service"
}`],notes:[`Titles evaporate. Of the 159 rows in this file, only 24 carry a title. The other 135 are a number, a decision and a reason. A title survives only if the AI happened to type one, and only for as long as that run's rows are the newest. And the two files disagree: 5400029920, tonight's NO, carries the title "CCTC Lawn Services" here in triage.json, yet its row in verdicts.json next door has no title field at all. On the board, only its reasoning text names it.`,"Bid A's journey ends here, three weeks after it started, having cost one title read."],tables:[]}],notes:[],then:"the portal's own work is done, and the shared machinery takes over"},{n:"8",title:"Carry-forward: this portal is not in it, on purpose",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:[`The shared safety net rescues verdicts for bids that dropped out of a night's pull. It only runs for portals whose registry entry says carry_forward: "orchestrator". This portal says "engine-internal", so the script never opens its archive.`,"What that means in plain terms: sc-sceis already did its own carry-forward at stage 7, when compile folded the 24 July verdicts into tonight's file. Running the shared script here as well would apply the same merge twice."],cells:[{label:"Except it did run once · real record · daily/2026-06-23/_carryforward_audit.json",paths:[],blocks:[`{
 "portal": "sc-sceis",
 "today": "2026-06-23",
 "prior_date_used": "2026-06-22",
 "today_new_judged": 3,
 "carried_forward": 0,
 "carried_forward_not_in_today_snapshot": 0,
 "dropped_too_old": 0,
 "dropped_already_judged_today": 2,
 "dropped_closed_award": 0,
 "final_total": 3,
 "final_yes": 2,
 "final_maybe": 1,
 "final_no": 0,
 "max_age_days": 90
}`],notes:["Only this script writes that file, and it was never supposed to touch this portal. So the contract was broken at least once, on 23 June. The good news is in the numbers: carried_forward is 0 and dropped_already_judged_today is 2. The merge at stage 7 had already done the work, the script found nothing to add, and nothing was double-counted. It has not happened again in the 22 archive days on record."],tables:[]}],notes:[],then:"the ledger, the report and the board fixture"},{n:"9",title:"Ledger, report, fixture",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared scripts read this portal's dated folders. The first walks all 22 of them and folds every YES into the all-portal ledger. The second throws away the report that compile just wrote and rewrites it in the layout every portal shares. The third turns the YES rows into cards for the operator board.","The timestamps show the order: the pull finished at 21:58, the archive was compiled at 22:05, and the report you can read on disk was rewritten at 22:37."],cells:[{label:"In → Out",paths:[{path:"data/sc-sceis/daily/*/verdicts.json",size:"22 folders"},{path:"data/portals/cumulative-yes.json + .md",size:"all-portal YES ledger"},{path:"daily/2026-07-28/report.md",size:"1,762 bytes, overwritten"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"board cards"}],blocks:[],notes:['The MAYBE never reaches the board. Board policy is YES-only for portals that are not federal, and this one is not. So the 55-score "STC EMERGENCY CLEAN UP AND RESTORATION" is printed in the report, counted in the funnel, and then dropped before the fixture. 2 of 159 rows go forward.'],tables:[]},{label:"Real file · the YES section of the rewritten report.md",paths:[],blocks:[`## YES — Max would bid

- **[92] *ON CALL TREE REMOVAL GREENVILLE** —
 Transportation · closes 2026-08-24
 State DOT three-year on-call tree removal,
 stump grinding and debris disposal in the
 highway right-of-way with 24/7 emergency
 call-outs - the exact contract shape LGS wins.
 _flags: out_of_core_state,
 mandatory_5yr_tree_removal_experience…_

- **[78] District 1 Landscaping 5 Year** —
 Transportation · closes 2026-07-28
 A 5-year DOT roadside landscaping/grounds-
 maintenance contract from SC DOT District 1 is
 squarely LGS vegetation/grounds work …
 _flags: thin_description_pull_rfp_packet,
 out_of_core_state, confirm_landscaping_is_veg…_`],notes:["The second YES closes on 28 July, the day of the run. It scored 78 from its title alone, and its first red flag says exactly that: pull the RFP packet."],tables:[]}],notes:[],then:"bids stop being SCEIS bids here"},{n:"10",title:"Onto the shared board, and into clusters",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["Every portal's YES rows go into one table and are grouped into cross-portal clusters, so the same solicitation seen in two places becomes one row for the operator. This is the first moment an SCEIS bid can meet its twin: the same solicitation advertised on SCBO or picked up by an aggregator. It happened this run — by the time stage 12 read the clusters, Bid B's cluster already held a bidprime row next to the SCEIS one.","One helpful detail: this portal is not treated as an aggregator, so when a cluster has to pick a display buyer, the named SC agency beats an aggregator's generic label."],cells:[{label:"In → Out",paths:[{path:"PortalPro/src/fixtures/portal-bids.json",size:"the YES cards"},{path:"daily/2026-07-28/stats.json + new-bids.json",size:"the run record"},{path:"supabase: bids, clusters, sweep_runs, portals",size:"upsert"}],blocks:[],notes:["The documents are lost right here. The snapshot row for Bid B carries two document links and a named procurement officer. The board card carries the contact, and has_documents: false. The one time this portal ever captured a file, the card does not know it."],tables:[]},{label:"Real card Bid B on the board",paths:[],blocks:[`{
 "id": "7106a8570df92d45",
 "portal": "sc-sceis",
 "portal_label": "South Carolina SCEIS",
 "source_bid_id": "5400030004",
 "title": "*ON CALL TREE REMOVAL GREENVILLE",
 "buyer": "Transportation",
 "state": "SC",
 "solicitation_no": null,
 "federal": false,
 "score": 92,
 "verdict": "yes",
 "category": "",
 "due_date": "2026-08-24",
 "contact_name": "Tamika Thomas",
 "contact_email": "ThomasTS@scdot.org",
 "contact_phone": "864-241-1010 ext. 6027",
 "red_flags": [
 "out_of_core_state",
 "mandatory_5yr_tree_removal_experience_
 plus_5_references"
 ],
 "fit_signals": [],
 "first_seen": "2026-07-28",
 "last_seen": "2026-07-28",
 "has_documents": false
}`],notes:["solicitation_no is null even though source_bid_id is the solicitation number. Dedup at stage 12 matches on that field."],tables:[]}],notes:[],then:"the board tries to fill what the portal could not"},{n:"11",title:"Enrichment, documents, requirements",who:"2.85b run_enrichment_phase.py · 2.87 extract_doc_text.py → requirements-extractor → apply_requirements.py → publish_doc_gaps.py",summary:["The board runs a list of enrichment passes to fill blanks. None of them target this portal. Its registry entry has an empty enrich_passes list and no pass names the slug. So the only thing that runs for sc-sceis is the last step, which writes down why a bid is still missing its files.","Requirements are then pulled from document text, per cluster, not per portal. A bid gets requirements only through the cluster it landed in, and only if that cluster has document text from somewhere."],cells:[{label:"What this portal actually contributes",paths:[],blocks:[],notes:['The honest version of "no documents". Saying this portal captures no documents was true of every run until this one. On 28 July one bid arrived with two document links already attached, and stage 10 dropped the flag that would have told the requirements step they exist. So the gap reason will say "not yet diagnosed" for a bid whose 53-page solicitation PDF is sitting in the snapshot file on disk.'],tables:[[{header:!1,cells:["Enrichment passes for sc-sceis","none. enrich_passes: [] in the registry"]},{header:!1,cells:["Gap reason when documents are missing",'this portal has no entry in the known-walls list, so the reason falls back to a generic "not yet diagnosed"']},{header:!1,cells:["A cluster containing only sc-sceis bids",'gets a neutral "no material" requirements row rather than real requirements']},{header:!1,cells:["A cluster shared with SCBO — which is exactly what Bid B's cluster became",`inherits a pointer, not files. SCBO's own row 67670 sets documents_source_url back to the SCEIS attachment page and notes "solicitation files are hosted off-portal by the agency; SCBO publishes only the ad"`]}]]}],notes:[],then:"a second look at the merge, now that fields are fuller"},{n:"12",title:"Dedup, second pass",who:"2.875 · llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["Pairs that were not comparable before are re-checked after enrichment has filled in blank buyers, closing dates and solicitation numbers. This is the last chance for an SCEIS bid to merge with the same solicitation posted elsewhere.","It matters more here than elsewhere, because 158 of the 159 rows have no description at all. For those, the only things left to match on are the title, the one-word buyer and the closing date. The 159th row is Bid B, and it is the exception that carried the night: the hand enrichment gave it real scope text, and its SCBO twin brought the solicitation number this portal never writes."],cells:[{label:"In → Out",paths:[{path:"data/portals/llm-dedup-candidates.json",size:"231,157 bytes · 120 pairs · written 22:41"},{path:"data/portals/llm-dedup-merges.json",size:"5,150 bytes · 17 merge rulings · written 22:51"},{path:"supabase: clusters",size:"apply_llm_dedup.py PATCHes the board and writes nothing to disk"}],blocks:[],notes:["The SCBO overlap is nearly all lost, but not all of it. South Carolina's other portal, SCBO, advertises many of the same solicitations. Comparing the two 28 July snapshot files by title, 38 titles appear in both — 40 of this portal's 159 rows. 37 of those 38 never reach the cluster layer, and the cause is not the dedup step. It is the YES-only filter two stages earlier: 157 of this portal's 159 rows and 442 of SCBO's 449 are dropped before anything is published. A merge step cannot merge rows that were never sent to it. One of the 38 got through, and it is Bid B."],tables:[]},{label:"Real record Bid B · the first pair in llm-dedup-candidates.json",paths:[],blocks:[`{
 "a": {
 "cluster_id": "9a80e034-aea6-45de-…",
 "portals": ["scbo"],
 "title": "*ON CALL TREE REMOVAL GREENVILLE",
 "buyer_norm": "department of transportation",
 "solno_norm": "5400030004"
 },
 "b": {
 "cluster_id": "ebab642a-c6e2-4080-…",
 "portals": ["bidprime", "sc-sceis"],
 "title": "*ON CALL TREE REMOVAL GREENVILLE",
 "buyer_norm": "transportation",
 "solno_norm": ""
 },
 "jaccard": 1.0,
 "same_due": true
}`,`{
 "a": "9a80e034-aea6-45de-83ba-a8c9eb8c753f",
 "b": "ebab642a-c6e2-4080-9c90-39114dbe002d",
 "confidence": "high",
 "reason": "same solno 5400030004 + same due
 2026-08-24 + same SCDOT On-Call Tree
 Removal Greenville scope"
}`],notes:["The SCEIS side had no number to match on — solno_norm is empty, exactly as stage 10 warned. SCBO carried it, so the judge matched on SCBO's number plus the identical title and the same closing date. Whether the PATCH landed on the board is only visible in Supabase; the apply step writes nothing to disk, so this page cannot show it."],tables:[]}],notes:[],then:"what changed, who gets told, did the run finish"},{n:"13",title:"Watch, digests, sentinel",who:"2.88 · watch_list_signals.py · bid_watch.py · new_bids_email.py · alerts_engine.py · pipeline_sentinel.py",summary:["Watch mode is none for this portal, so no page is re-captured and no change is detected for an SCEIS bid after it is first seen. If SCDOT posts an addendum, nothing here notices.","Its bids still reach the daily emails, but through their board clusters, not through anything portal-specific. The sentinel then checks that every portal completed every phase and writes the run's health file."],cells:[{label:null,paths:[],blocks:[],notes:[],tables:[[{header:!1,cells:["Page re-capture / addendum watch",'off, registry watch: "none"']},{header:!1,cells:["New-bid and watch digests","written to data/portals/daily-new-bids.md and daily-watch-digest.md"]},{header:!1,cells:["Sending the mail","dead until RESEND_API_KEY exists in data/auth/resend.env"]},{header:!1,cells:["Sentinel","writes data/portals/sentinel.json; a missing stats.json would mark this portal FAILED in the roll-up"]}]]}],notes:[],then:null}],d=[{heading:"The quirks that bite: all on one card",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["The list page has no description column, and no code opens the detail page",'158 of 159 rows carry description: "" forever; triage and most judging happen on a title and a one-word buyer']},{header:!1,cells:["One row was enriched on 28 July by hand, not by code",`the 8.5 KB scope text, two documents and a named contact on bid 5400030004 came from an agent fetching the PDF live. No script in the repo can do it. It will not happen again on its own, and the model doc's "descriptions stay empty forever" and its documents/contact walls are now stale for this row`]},{header:!1,cells:["The board card says has_documents: false for a bid whose snapshot row lists two documents","the one time this portal captured files, the board and the requirements step never learned about them"]},{header:!1,cells:["Titles survive only if the AI typed one",`24 of the 159 rows in triage.json have a title. The same run's verdicts.json disagrees with it: bid 5400029920 is titled "CCTC Lawn Services" in triage and has no title field at all in the verdict row, so on the board only its reasoning text names it`]},{header:!1,cells:["Two key shapes for one verdict: would_lgs_bid/score vs verdict/lgs_score","compile stores both, so nothing breaks here; any other reader that picks one name will read nothing on some nights"]},{header:!1,cells:["runs/judge-input.json is written every run and read by nothing","88,911 bytes of empty bodies. The real judge queue is rebuilt from the snapshot at stage 5, which is the only reason the hand enrichment reached the judge at all"]},{header:!1,cells:["Cadence 3, and 4 days had passed since 24 July","the portal is dark two nights in three. Diff-first makes that lossless, but a bid closing inside the gap can be seen for the first time on the day it closes: the 78-score YES that night closed on 28 July"]},{header:!1,cells:["data/sc-sceis/scripts/run_daily.py opens with a copy-pasted bidexpress docstring","it claims the sweep is outside the /portals batch and reads auth cookies. Both are false: the registry says batch portals, and the engine has no login. No runtime effect, but it misleads anyone reading the entry point"]},{header:!1,cells:["The orchestrator carry-forward ran here once on 23 June, against the registry contract","the audit file it left shows carried_forward: 0, so nothing was double-applied. Worth watching, not worth alarm"]},{header:!1,cells:["38 titles collide with SCBO; only one pair ever reaches the cluster layer","the YES-only fixture drops 157 of this portal's 159 rows and 442 of SCBO's 449 before publish, so 37 of the 38 twins are never compared. The 38th is Bid B: both sides published, and the dedup judge ruled merge at high confidence off SCBO's solicitation number, because the SCEIS side carries none"]},{header:!1,cells:["data/sc-sceis/PORTAL.md reports 100% contact and 33% document coverage","those numbers come from the board after cluster-level work, not from this portal's own capture. The runbook is still an auto-generated draft whose whole field map is TODO. Do not read it as a capture rate"]},{header:!1,cells:["data/sc-sceis/recon/ exists and is empty","created by the shared code, never filled"]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to data/sc-sceis/daily/2026-07-28/stats.json, a row count, a byte size on disk, or — for the SCBO overlap at stage 12 — a title comparison between the two named 28 July snapshot files. Where the files and the model disagreed, the files won and the page says so. Baseline map: docs/portal-dataflow/sc-sceis.md (evidence-cited to file:line)."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to data/sc-sceis/daily/2026-07-28/stats.json, a row count, a byte size on disk, or — for the SCBO overlap at stage 12 — a title comparison between the two named 28 July snapshot files. Where the files and the model disagreed, the files won and the page says so. Baseline map: docs/portal-dataflow/sc-sceis.md (evidence-cited to file:line).",c="docs/portal-dataflow/pedia-sc-sceis.html",p={slug:e,title:t,eyebrow:s,headline:a,lede:n,funnel:o,funnel_note:r,legend:i,stages:l,sections:d,footer:h,source_page:c};export{p as default,s as eyebrow,h as footer,o as funnel,r as funnel_note,a as headline,n as lede,i as legend,d as sections,e as slug,c as source_page,l as stages,t as title};
