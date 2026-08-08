const e="sam-gov",t="SAM.gov: what happens to a bid, stage by stage",a="Portal pedia · 43",s="SAM.gov: what happens to a federal bid, from two nets to the board",n="Every stage of the nightly run, with a real record from the actual files at each step. All data is from the run of 28 July 2026. The headline that night: both tracer bids were already known. Neither one went through this night's triage or judge. So a third bid is followed as well, one that really was new that night and ran the whole path from pull to a scored YES.",o=[{value:"406",label:"in snapshot"},{value:"307",label:"carryover"},{value:"99",label:"new tonight"},{value:"122",label:"triage says open"},{value:"284",label:"triage says skip"},{value:"37",label:"yes"},{value:"33",label:"maybe"},{value:"61",label:"no"}],i="Source: data/sam-gov/daily/2026-07-28/stats.json (471 bytes). Read the last three cells carefully. 37 + 33 + 61 = 131 scored bids, but only 99 bids were new that night. That is not a mistake. verdicts.json on this portal is the running live set, not one night's work: 46 of those 131 rows were judged by this run, and 85 were copied forward from earlier days. The snapshot itself is 406 open biddable federal notices pulled out of 2,714 raw records (data/sam-gov/bids/index.json, data/sam-gov/logs/pull_log.txt).",r=["Bid A · ebca59a5… · J045--Drain and Grease Trap Maintenance, VA Tampa. Known since an earlier day, carried as SKIP.","Bid B · fd1a80f4… · F--Mastication, Gautier Unit Mississippi Sandhill NWR. Carried as OPEN, YES 88 from 24 July.","Bid C · 21075fe8… · Tree Removal Services, Littleville Lake and Knightville Dam. Genuinely new on 28 July, ends YES 80."],d=[{n:"0",title:"Is it due tonight?",who:"scripts/portal_due.py --batch portals",summary:["The gate looks at the newest dated folder under data/sam-gov/daily/. The cadence is one day, so sam-gov is due every night. A missed night costs nothing, because the sweep compares against its own archive rather than against yesterday.","There are 17 dated archive folders on disk, from 25 June to 28 July. The gaps in that list are nights the sweep did not run."],cells:[{label:"In",paths:[{path:"data/portals/registry.json",size:"the offline fallback; live cadence lives in Supabase"},{path:"data/sam-gov/daily/*/",size:"17 dated folders"}],blocks:[],notes:[],tables:[]},{label:"The registry row that governs everything below",paths:[],blocks:[`{
 "slug": "sam-gov",
 "label": "SAM.gov Federal Opportunities (via GovConAPI)",
 "engine": "govconapi",
 "batch": "portals",
 "cadence_days": 1,
 "authed": true,
 "enrich_passes": [],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:["Three of these lines are contradicted elsewhere in the repo. See the quirks table at the bottom."],tables:[]}],notes:[],then:"due, so the pull runs: one code query plus 21 word searches, no browser anywhere"},{n:"1",title:"Two nets over the federal feed",who:"data/sam-gov/scripts/run_daily.py · step 1: pull",summary:["SAM.gov is the government's own contract board. We read it through GovConAPI, a paid mirror that answers with a plain JSON reply and a key, so there is no browser and no login page.","Two nets are cast. The first asks for eight industry codes at once. The second asks 21 separate word searches, one per phrase LGS cares about. The two catches are merged by notice id. The word net exists because federal buyers file tree work under the wrong code all the time."],cells:[{label:"What the two nets actually caught that night",paths:[{path:"data/sam-gov/bids/all-bids.json",size:"4.03 MB · 406 rows · 22 fields"},{path:"data/sam-gov/bids/index.json",size:"430 bytes"}],blocks:[`[naics x8] +1901 new (raw total 1901)
[kw:hazard tree] +17 new (raw total 1918)
[kw:tree removal] +58 new (raw total 1976)
[kw:vegetation
 management] +97 new (raw total 2093)
[kw:land clearing] +157 new (raw total 2251)
[kw:debris removal] +174 new (raw total 2425)
[kw:line clearance] +198 new (raw total 2623)
[kw:mastication] +11 new (raw total 2714)

raw 2714 -> kept 639
 (dropped 333 non-biddable-type
 / 1742 past-deadline)
deduped 639 -> 406
 (collapsed 233 amendment/stage
 notices by solicitation_number)`],notes:["From the 28 July block of data/sam-gov/logs/pull_log.txt, showing the nets that caught the most; the 13 word searches that added little or nothing are left out, which is why the running totals jump. The code net found 1,901. The word net added 813 more that the codes alone would have missed. That is why both nets exist."],tables:[]},{label:"Real record Bid A",paths:[],blocks:[`{
 "bid_id": "ebca59a557bd43eca6225961d7526c79",
 "title": "J045--Drain and Grease Trap
 Maintenance",
 "buyer": "248-NETWORK CONTRACT OFFICE 8
 (36C248)",
 "agency_full": "VETERANS AFFAIRS, DEPARTMENT
 OF.VETERANS AFFAIRS, DEPARTMENT OF.248-…",
 "state": "FL",
 "due_date": "2026-07-28",
 "posted_date": "2026-07-23",
 "description": "CONTACT: Jose E. Ortiz-Velez ·
 Jose.Ortiz-Velez@va.gov · 813-938-0593\\n\\n
 Drain & Grease Trap Maintenance - JAHVH\\n
 Questions and Answers for RFQ# 36C24826Q0936…",
 "status": "open",
 "federal": true,
 "naics": "562998",
 "psc": "J045",
 "notice_type": "Combined Synopsis/Solicitation",
 "set_aside": "SBA",
 "solicitation_number": "36C24826Q0936",
 "place_of_performance": "Tampa FL 33612",
 "contact": {
 "name": "Jose E. Ortiz-Velez",
 "email": "Jose.Ortiz-Velez@va.gov",
 "phone": "813-938-0593",
 "title": "Senior Contracting Officer"
 },
 "documents": [
 {"file_name": "36C24826Q0936-1.pdf", …},
 … 6 files in total …
 ],
 "tags": ["federal", "govconapi", "SBA"]
}`],notes:["This is the good news about this feed. The full scope text, the buying officer's name and email, and links to every attached file all arrive in the first reply. No second visit is needed to make a bid readable. A phone number comes with it on 259 of the 406."],tables:[]}],notes:["The contact is also glued onto the front of the description. Every record starts with a CONTACT: line, so the standard publish path carries the officer's details even where it only knows how to read a description."],then:"tonight's 406 are compared against last night's archive"},{n:"2",title:"Split the snapshot into old and new",who:"data/sam-gov/scripts/run_daily.py · step 2: prep",summary:["The 406 bids are checked against the newest previous archive. A bid we have seen before keeps the decision it already had. Only a bid we have never seen goes to the AI. That is the whole reason this portal costs pennies a night instead of dollars.","That night: 413 ids in the 24 July archive were compared against. 307 of the 406 were already known. 99 were new. 106 bids that were in the 24 July archive had closed or dropped out of the feed and are simply gone."],cells:[{label:"Out",paths:[{path:"runs/triage-input.json",size:"23.5 KB · 99 rows · the new ones"},{path:"runs/triage-carryover.json",size:"49.5 KB · 307 rows · the known ones"},{path:"runs/judge-input.json",size:"3.51 MB · 406 rows · every bid with its full text"},{path:"runs/_funnel.json",size:"156 bytes"}],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 406,
 "carryover_count": 307,
 "triage_input_count": 99,
 "prior_archive_ids_compared_against": 413
}`],notes:["judge-input.json is big but it is not waste. Stage 8 filters it down to the few bids that still need scoring."],tables:[]},{label:"Both tracers land here, in the carryover file Bid ABid B",paths:[],blocks:[`{
 "idx": 5,
 "bid_id": "ebca59a557bd43eca6225961d7526c79",
 "decision": "SKIP",
 "reason": "drain/grease trap plumbing,
 wrong vertical"
}`,`{
 "idx": 8,
 "bid_id": "fd1a80f48e46466b8a3a0ec08e887c19",
 "decision": "OPEN",
 "reason": "fuels mastication, MS Sandhill NWR"
}`],notes:["This is where the two tracers stop being live traffic. Both were first seen on 24 July. On 28 July they are memory: their old decisions are copied across and neither is sent to any AI. For the next five stages there is no tracer record to show, because there is no tracer work. Those cards show a real row from that stage instead, clearly labelled."],tables:[]}],notes:[],then:"the 99 new bids get extra fields bolted on before the AI sees them"},{n:"3",title:"Fatten the triage rows (sam-gov only)",who:"no script · a child agent does this by hand",summary:["The shared prep only passes title, buyer, state and closing date. For a federal bid that is not enough. Federal titles are written in code: F--Mastication, J045--Drain, S208. Without the industry code and the notice type, the AI is guessing.","So before triage runs, each of the 99 new rows is joined back to the snapshot and given its industry code, notice type, set-aside and description length."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"99 rows, 6 fields each"},{path:"runs/triage-enriched-new.json",size:"34.9 KB · 99 rows, 10 fields each"}],blocks:[],notes:["Nothing in the code makes this happen. There is no script named triage-enriched anywhere in the repo. If a night's agent forgets this step, triage sees title-only rows and quietly gets worse. It is the single most fragile link in this portal's chain."],tables:[]},{label:"Real record Bid C, new tonight",paths:[],blocks:[`{
 "idx": 0,
 "bid_id": "21075fe84d6746018c49f4a79a2f03a1",
 "title": "Tree Removal Services, Littleville
 Lake and Knightville Dam, Huntington, MA",
 "buyer": "W2SD ENDIST NEW ENGLAND",
 "state": "MA",
 "naics": "561730",
 "notice_type": "Solicitation",
 "set_aside": "SBA",
 "due_date": "2026-07-28",
 "desc_len": 943
}`],notes:["The three fields the shared prep would have dropped are naics, notice_type and set_aside. On this bid the code 561730 means landscaping and tree work, which is the middle of what LGS does."],tables:[]}],notes:[],then:"99 rows go to the first AI, in four batches"},{n:"4",title:"Pass 1: open it or throw it out",who:"max-triage · AI",summary:["The AI reads each new bid's title, industry code and notice type and answers with one word. Default is SKIP. OPEN is for real LGS work: trees, vegetation, right-of-way, line clearance, storm and disaster debris, mowing, grounds, demolition, site clearing.","That night the first pass came back 35 OPEN and 64 SKIP out of 99. Everything a title alone can decide is decided here for a fraction of a cent."],cells:[{label:"In → Out",paths:[{path:"runs/t28-batch-{0..3}-input.json",size:"25+25+25+24 = 99 rows"},{path:"runs/t28-batch-{0..3}-out.json",size:"3.4 / 3.2 / 3.5 / 3.5 KB · 99 decisions"}],blocks:[],notes:["Beware the code 237130. In this feed that code is mostly electrical substation construction, not utility line clearing. The code helps but must never make the call by itself."],tables:[]},{label:"Real records, the first three rows of t28-batch-0-out.json Bid C is row 0",paths:[],blocks:[`{
 "idx": 0,
 "bid_id": "21075fe84d6746018c49f4a79a2f03a1",
 "decision": "OPEN",
 "reason": "Tier A tree removal, USACE dam/lake
 sites"
}`,`{
 "idx": 1,
 "bid_id": "c1f656fa97bd497aa293d98e63f228a2",
 "decision": "OPEN",
 "reason": "Dead/damaged tree removal = core
 hazard tree work"
}`,`{
 "idx": 2,
 "bid_id": "820eb576282c4658b0ebdc3bf8fee3c7",
 "decision": "SKIP",
 "reason": "Shipyard elevator dismantle,
 industrial/marine wrong vertical"
}`],notes:["Hold on to row 2. The next stage pulls it back out of the bin."],tables:[]}],notes:[],then:"every SKIP is read a second time, this time with the full text"},{n:"5",title:"The SKIP audit: go back through the bin",who:"no script · a child agent does this by hand · treated as mandatory",summary:["Federal titles hide the job. So after Pass 1 the agent re-reads every SKIP looking for vegetation words, pulls the full scope text for each hit, and decides again with the real text in hand.","That night 21 of the 64 SKIPs were pulled back out with their full scope text and 7 were flipped back to OPEN. That took the new-bid tally from 35 OPEN to 42 OPEN. One reject in nine was rescued."],cells:[{label:"In → Out",paths:[{path:"runs/skip-audit-candidates.json",size:"83.2 KB · 21 rows with full text"},{path:"runs/skip-audit-verdicts.json",size:"1.27 KB · 7 rows, all SKIP->OPEN"}],blocks:[`idx 2 238910 site-prep, dismantle/demolition
idx 20 561730 landscaping = LGS core code
idx 21 561730 landscaping = LGS core code
idx 22 561730 landscaping = LGS core code
idx 23 561730 landscaping + it is in MS
idx 25 561730 landscaping = LGS core code
idx 193 561790 exterior/grounds services`],notes:[],tables:[]},{label:"Real record, the flip on row 2 rescued",paths:[],blocks:[`{
 "idx": 2,
 "action": "SKIP->OPEN",
 "reason": "skip-audit: 238910 site-prep NAICS,
 dismantle/demolition - core LGS work,
 judge with description"
}`],notes:["Nothing downstream reads this file. A flip only counts if the agent also writes it back into runs/triage-verdicts.json by hand. On 28 July all 7 did make it back. A night where they do not would lose seven real bids and leave no trace.","That is Dry Dock Elevator Dismantle, Pearl Harbor Naval Shipyard. The audit was right to reopen it and the judge later scored it NO, 20, because the scope turned out to be taking apart three elevators inside a shipyard, with no land and no vegetation. That is the audit working as designed. It buys a proper look, not a free yes."],tables:[]}],notes:[],then:"and then the same trick is played on OLD skips"},{n:"6",title:"The carry audit: reopening yesterday's rejects",who:"no script · a child agent · not in the model doc at all",summary:["A second audit ran that night, and this one is not described anywhere in the portal's model document. It went back into the 307 carried-over bids, found four old SKIPs matching an erosion and emergency-watershed pattern, and re-judged them with their full text.","Two of the four were overturned. One became MAYBE at 50, one became YES at 70. All four were written into runs/triage-verdicts.json as OPEN, which is why that file has 103 rows when only 99 bids were new."],cells:[{label:"In → Out",paths:[{path:"runs/carry-audit-input.json",size:"19.8 KB · 4 rows"},{path:"runs/carry-audit-out.json",size:"7.7 KB · 4 rows"}],blocks:[`effb15a9… overturned=true maybe 50
7a257c3c… overturned=false no 22
5a8613f0… overturned=false no 28
d5f0d2d8… overturned=true yes 70`,`{
 "idx": 395,
 "bid_id": "d5f0d2d84b6b43ee81578a3f68518beb",
 "decision": "OPEN",
 "reason": "carryover-SKIP recall audit
 (NRCS/EWP/erosion pattern) - re-opened
 and judged with description"
}`],notes:[],tables:[]},{label:"Real record, the one that flipped to YES 70 · from carry-audit-out.json, with its prior_skip_reason from carry-audit-input.json",paths:[],blocks:[`{
 "bid_id": "d5f0d2d84b6b43ee81578a3f68518beb",
 "title": "ATLANTIC INTRACOASTAL WATERWAY (AIWW)
 SNOWS CUT BANK STABILIZATION",
 "buyer": "W074 ENDIST WILMINGTON",
 "state": "NC",
 "naics": "237990",
 "notice_type": "Presolicitation",
 "prior_skip_reason": "waterway bank stabilization
 civil construction, wrong vertical",
 "would_lgs_bid": "yes",
 "score": 70,
 "primary_reason": "The prior skip called this pure
 civil construction and the description says
 otherwise, clearing is the first-named element
 of the method: 'Bank stabilization would involve
 vegetation clearing, sloping of bank, the
 placement of riprap…'. That is 'up to 7,100 feet
 of shoreline along four distinct areas'…",
 "service_match": "adjacent",
 "scale_match": "above_floor",
 "red_flags": [
 "federal",
 "hybrid_includes_riprap_and_breakwater_
 heavy_civil",
 "out_of_core_state_NC",
 "no_bid_opening_date_yet_presolicitation",
 … 7 flags in total …
 ],
 "prior_skip_overturned": true
}`],notes:[],tables:[]}],notes:["The model document is stale here. docs/portal-dataflow/sam-gov.md has no stage for the carry audit and does not name carry-audit-input.json or carry-audit-out.json. Both files were written on 28 July and both changed the night's numbers. The files win."],then:"normally the OPENs would now get a second web visit. Not here."},{n:"7",title:"Go and fetch the scope: nothing to do",who:"ps.enrich_opens(PORTAL, config, open_ids)",summary:["On most portals this is the expensive stage. A browser opens each OPEN bid's page and scrapes the scope text, because the list page never carried it.","For sam-gov nothing happens at all. The engine has no fetch-the-detail function and does not need one. The scope, the contact and the file links all arrived in stage 1."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json",size:"the OPEN ids"},{path:"nothing",size:"no file written, no request made"}],blocks:[],notes:["The file bytes are a separate job, much later. GovConAPI hands over the opportunity but not the actual PDFs. Those are downloaded in phase 2.85b, after publishing, by scripts/sam_gov_attachment_docs.py, straight from SAM.gov's own site."],tables:[]}],notes:[],then:"build the short list of bids that still need a score"},{n:"8",title:"Who actually needs judging tonight",who:"ps.build_judge_input_open(PORTAL)",summary:["122 bids sit at OPEN across the whole snapshot, but most of them already have a score from an earlier night. This stage picks only the ones that still need one: tonight's new OPENs, plus any old OPEN that has been waiting without a verdict, plus any already-judged bid whose text changed.","That came to 42 bids. The other 80 OPENs keep the score they already had. This is the fix that stops a bid opened on Monday from sitting unscored forever."],cells:[{label:"In → Out",paths:[{path:"runs/judge-input.json",size:"406 rows, filtered down"},{path:"runs/triage-verdicts.json + runs/triage-carryover.json",size:"who is OPEN"},{path:"runs/judge-input-open.json",size:"184 KB · 42 rows"}],blocks:[],notes:["A hand-written flip that never gets written back is invisible here. This stage only reads triage-verdicts.json. The seven SKIP-audit rescues and the four carry-audit reopens reached the judge only because the agent edited that file."],tables:[]},{label:"Real record Bid C, row 0 of 42",paths:[],blocks:[`{
 "idx": 0,
 "bid_id": "21075fe84d6746018c49f4a79a2f03a1",
 "title": "Tree Removal Services, Littleville
 Lake and Knightville Dam, Huntington, MA",
 "buyer": "W2SD ENDIST NEW ENGLAND",
 "state": "MA",
 "due_date": "2026-07-28",
 "detail_url": "https://sam.gov/workspace/contract/
 opp/21075fe84d6746018c49f4a79a2f03a1/view",
 "description_full": "Title: Tree Removal Services,
 Littleville Lake and Knightville Dam,
 Huntington, MA\\nBuyer: W2SD ENDIST NEW
 ENGLAND\\nState: MA\\nCloses: 2026-07-28\\n
 Source URL: https://sam.gov/…\\n\\nRFP body:\\n
 CONTACT: Alicia LaCrosse · alicia.n.l…"
}`],notes:["The description block is rebuilt from tonight's snapshot, not from the copy prep made earlier, so the judge reads the current text."],tables:[]}],notes:[],then:"42 bids, four batches, the second AI scores them"},{n:"9",title:"Pass 2: yes, maybe or no, with a number",who:"max-bid-judge · AI",summary:["Each of the 42 gets a verdict, a score out of 100, a written reason quoting the actual scope, and two lists: what fits and what worries. Every federal bid is flagged federal, and anything outside the southeast also gets out_of_core_state.","Output was 46 rows: the 42 from this batch plus the 4 the carry audit judged."],cells:[{label:"In → Out",paths:[{path:"runs/j28-batch-{0..3}-input.json",size:"11+11+11+9 = 42 rows"},{path:"runs/j28-batch-{0..3}-out.json",size:"16.4 / 16.3 / 15.5 / 13.5 KB"},{path:"runs/judge-verdicts.json",size:"90.3 KB · 46 rows"}],blocks:[],notes:["The judge quotes the document. Read Bid C's reason on the right. It names the tree count out of the work statement. That is the difference between a score you can act on and a guess."],tables:[]},{label:"Real record Bid C, YES 80",paths:[],blocks:[`{
 "bid_id": "21075fe84d6746018c49f4a79a2f03a1",
 "title": "Tree Removal Services, Littleville
 Lake and Knightville Dam, Huntington, MA",
 "buyer": "W2SD ENDIST NEW ENGLAND",
 "state": "MA",
 "naics": "561730",
 "notice_type": "Solicitation",
 "set_aside": "SBA",
 "would_lgs_bid": "yes",
 "score": 80,
 "category": "tree removal / stump grinding",
 "primary_reason": "The work statement is verbatim
 LGS core: \\"removal and disposal of approximately
 335 trees and 20 stumps at the Knightville Dam
 Project ... and 230 trees at Littleville Lake
 Project.\\" That is ~565 trees plus stumps across
 two USACE dam/lake projects, a real crew-week
 job, not a one-off yard call.",
 "service_match": "core",
 "scale_match": "borderline",
 "buyer_match": "adjacent",
 "red_flags": [
 "federal",
 "federal_setaside_flag_sba_small_business_9.5m",
 "out_of_core_state_MA",
 "active_sam_gov_registration_required_at_
 submission",
 "single_project_pair_no_multi_year_term"
 ],
 "fit_signals": [
 "explicit tree removal and disposal scope",
 "565 trees + 20 stumps quantified",
 "stump removal included",
 "NAICS 561730 landscaping/tree services",
 "USACE dam and lake ROW-type sites"
 ],
 "federal": true,
 "out_of_core_state": true,
 "verdict": "yes",
 "lgs_score": 80,
 "reasoning": "The work statement is verbatim LGS
 core: …"
}`],notes:["Note the doubled keys. would_lgs_bid and verdict hold the same word; score and lgs_score the same number. Agents have returned two shapes over the years, so the compile step writes both."],tables:[]}],notes:[],then:"the night is written down"},{n:"10",title:"Write the archive, and carry the past forward",who:"ps.compile_archive(PORTAL, config)",summary:["Carryover and new triage are merged into one file of 406 decisions. Tonight's 46 verdicts are merged with every earlier verdict whose bid is still in tonight's snapshot, giving 131 rows. The test is snapshot membership, not OPEN, which is why 61 of the 131 are a NO. Then the counts, the report and the index line are written.","This merge is the whole of this portal's memory. There is no separate safety net script. verdicts.json is the living record."],cells:[{label:"Out · data/sam-gov/daily/2026-07-28/",paths:[],blocks:[`new bids triaged 35 OPEN 64 SKIP
+ SKIP-audit flips +7 OPEN -7 SKIP
 = 42 OPEN 57 SKIP
carried-over bids 76 OPEN 231 SKIP
+ carry-audit reopens +4 OPEN -4 SKIP
 = 80 OPEN 227 SKIP
 ---------------
archive triage.json 122 OPEN 284 SKIP`],notes:[],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","406 rows, the full snapshot","4.03 MB"]},{header:!1,cells:["triage.json","406 decisions: 122 OPEN, 284 SKIP","66.3 KB"]},{header:!1,cells:["verdicts.json","131 scored bids: 37 yes, 33 maybe, 61 no","190 KB"]},{header:!1,cells:["stats.json","the funnel counts","471 bytes"]},{header:!1,cells:["report.md","the operator's read of the night","34.0 KB"]}]]},{label:"Real record Bid B, the 88 it kept",paths:[],blocks:[`{
 "bid_id": "fd1a80f48e46466b8a3a0ec08e887c19",
 "title": "F--Mastication, Gautier Unit
 Mississippi Sandhill NWR",
 "buyer": "FWS SAT TEAM 3",
 "state": "",
 "due_date": "2026-07-29",
 "naics": "115310",
 "notice_type": "Combined Synopsis/Solicitation",
 "set_aside": "SBA",
 "would_lgs_bid": "yes",
 "score": 88,
 "category": "fuels_reduction_mastication",
 "primary_reason": "FWS fuel-reduction mastication on
 the Gautier Unit of the Mississippi Sandhill
 Crane NWR - core fuels/mastication work sitting
 in LGS's home state with a 12-month performance
 window.",
 "service_match": "core",
 "scale_match": "unknown",
 "buyer_match": "adjacent",
 "red_flags": ["federal", "federal_setaside_SBA"],
 "fit_signals": [
 "mastication = core IVM/fuels method",
 "Mississippi home turf",
 "NAICS 115310 forestry support"
 ],
 "federal": true,
 "verdict": "yes",
 "lgs_score": 88
}`],notes:["No AI produced this row on 28 July. The identical row, same score of 88, is in data/sam-gov/daily/2026-07-24/verdicts.json. Bid B was judged once on 24 July and this stage has copied it forward every night since. 85 of the 131 rows in tonight's file arrived exactly this way."],tables:[]}],notes:[],then:"the portal's own night is over. The shared machinery takes over."},{n:"11",title:"The shared safety net skips this portal on purpose",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:[`Across the estate there is a script that rescues verdicts for bids that fell out of a night's pull. It only touches portals whose registry line says carry_forward: "orchestrator".`,'sam-gov says "engine-internal", which means the carrying already happened one stage ago, inside compile. Running the shared script here would apply the same rescue twice. So it is skipped, and that is correct, not an oversight.'],cells:[{label:"Proof that it has never been hand-run here",paths:[],blocks:[],notes:["One way to break it. Running the script by hand with --portal sam-gov bypasses the registry check and would double-apply. Do not."],tables:[[{header:!1,cells:["No _carryforward_audit.json in any of the 17 dated folders","the script writes one every time it touches a portal"]},{header:!1,cells:["No sam-gov verdict row carries _first_judged or _carryforward_from","the script stamps both"]},{header:!1,cells:["Bid B's 88 carried anyway, from 24 July to 28 July","compile did it, exactly as designed"]}]]}],notes:[],then:"the ledger, the report and the board fixture"},{n:"12",title:"Ledger, rewritten report, board cards",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three small steps. Every dated verdicts file for every portal is walked into one running list of yes and maybe. The compact report.md that compile just wrote is overwritten with the shared operator layout. Then the yes and maybe rows become cards for the review board.","sam-gov is a federal feed, so both yes and maybe are dumped, not yes alone. Every card gets a federal flag so no one accepts one by accident."],cells:[{label:"Out",paths:[{path:"data/portals/cumulative-yes.json + .md",size:"the running ledger"},{path:"data/sam-gov/daily/2026-07-28/report.md",size:"34.0 KB, rewritten in place"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"1,470 cards total"}],blocks:[`208 cards 116 yes 92 maybe
172 of 208 have documents
 0 of 208 have contact_email`],notes:["208 is the third-largest block on the board, behind bidnet's 480 and napc's 309. The model doc says 175 and calls sam-gov the largest block of any portal, both measured on 26 July. The file on disk says 208 and puts sam-gov third, so both model lines are out of date."],tables:[]},{label:"Real card Bid B on the board",paths:[],blocks:[`{
 "id": "91db4aad1f16c83a",
 "portal": "sam-gov",
 "portal_label": "SAM.gov Federal Opportunities
 (via GovConAPI)",
 "source_bid_id": "fd1a80f48e46466b8a3a0ec08e887c19",
 "title": "F--Mastication, Gautier Unit
 Mississippi Sandhill NWR",
 "buyer": "FWS SAT TEAM 3",
 "state": "",
 "solicitation_no": "140FS326R0009",
 "federal": true,
 "score": 88,
 "verdict": "yes",
 "category": "fuels_reduction_mastication",
 "due_date": "2026-07-29",
 "contact_name": null,
 "contact_email": null,
 "contact_phone": null,
 "red_flags": ["federal", "federal_setaside_SBA"],
 "fit_signals": [],
 "first_seen": "2026-07-24",
 "last_seen": "2026-07-28",
 "has_documents": true
}`],notes:['Look at the three contact lines. Stage 1 captured "Riley, Fred", fred_riley@ios.doi.gov and 413-253-8738 for this exact bid. The card carries none of them. The fixture drops the contact. A later shared pass is supposed to lift it out of the description into proper columns in the database, which this page cannot see from disk, but the card itself is empty for all 208 sam-gov rows.'],tables:[]}],notes:[],then:"bids stop being sam-gov's here"},{n:"13",title:"Publish, cluster, merge the duplicates",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["The cards are pushed into the shared database and grouped with every other portal's bids. A federal solicitation that also shows up on a state board collapses into a single row for the operator. From here the unit of work is a cluster, not a sam-gov bid."],cells:[{label:"Tables written",paths:[],blocks:[],notes:[],tables:[[{header:!0,cells:["Table","What lands there"]},{header:!1,cells:["portals",'one row: key sam-gov, label "SAM.gov (Fed)" on the boards']},{header:!1,cells:["bids","the 208 yes and maybe rows, with source url, description and verdict"]},{header:!1,cells:["clusters","grouping across portals, with one bid picked as the canonical one"]},{header:!1,cells:["sweep_runs","one row per portal per night: yes, maybe, open, raw and no counts from stats.json"]}]]}],notes:[],then:"now go and get the actual PDFs"},{n:"14",title:"Documents, then requirements",who:"2.85b run_enrichment_phase.py · 2.87 extract_doc_text.py → requirements-extractor",summary:["GovConAPI names the files but does not hand them over. So after publishing, a pass goes to SAM.gov's own site for every live sam-gov YES or MAYBE cluster with no documents and downloads them. Bid B has nine PDFs waiting. What they are is not on disk: GovConAPI returns every one of them named 140FS326R0009-1.pdf through -9.pdf with an empty file_description, so nothing here can say which is the solicitation and which is the wage determination until the bytes are pulled and read at 2.87.",'Then the text inside those PDFs is read and turned into a requirements list per cluster. Clusters with no material at all get a plain "nothing to read" row rather than a blank.'],cells:[{label:"Real record, the file links stage 1 already recorded Bid B",paths:[],blocks:[`"documents": [
 {"file_name": "140FS326R0009-1.pdf",
 "file_url": "https://sam.gov/api/prod/opps/v3/opportunities/
 resources/files/09e7be3ac8454281adec837d47501374/download",
 "file_description": ""},
 … 9 files in total, -1.pdf through -9.pdf …
]`],notes:["Two things bite here. First, SAM.gov's own file service refuses the request unless it is sent with a sam.gov referrer header, so a naive fetch returns an error. Second, some notices point at PIEE deep links instead of files; when nothing can be pulled, an honest gap reason naming the host is published rather than a silent blank. Document coverage was measured at 75% on 14 July.",'The registry is wrong about this stage. The registry row says enrich_passes: [] and data/sam-gov/PORTAL.md says "enrich passes: none". In fact six shared passes in scripts/enrichers.py touch this portal every night: sam-gov attachments (line 105), engine-recorded docs (99), page-text render floor (119), enrich_all_gaps (120), contact columns (121) and publish coverage (122). Every one is registered kind="global" rather than portal="sam-gov", so the registry cannot see them.'],tables:[]}],notes:[],then:"now that buyers and dates are filled in, look for duplicates again"},{n:"15",title:"The dedup re-pass",who:"2.875 · llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py, second run",summary:["The first dedup at 2.85 ran on thin rows. Enrichment has since filled in buyers, closing dates and solicitation numbers, which is exactly the information that proves two listings are the same job. So dedup runs a second time on the improved data.","If it proposes nothing, it stops there. Running the chain twice in a day cannot merge anything twice, because every judged pair is remembered and already-merged clusters are skipped."],cells:[{label:null,paths:[],blocks:[],notes:["This stage is not in sam-gov's model document. docs/portal-dataflow/sam-gov.md jumps from 2.87 straight to 2.88. The re-pass is defined in the shared portals runbook and runs across the whole estate, so it reaches sam-gov's clusters like everyone else's. The sam-gov page of the model simply does not mention it.","Why it matters more here than elsewhere. One federal solicitation can appear under many notice ids, one per amendment. Stage 1 already collapsed 233 of those by solicitation number that night. Any that slip through, or that also appear on a state board, are cluster work."],tables:[]}],notes:[],then:"what changed, who needs telling, did the run finish"},{n:"16",title:"Watch, mail, check the run",who:"2.88 watch_list_signals.py · new_bids_email.py · bid_watch.py · pipeline_sentinel.py",summary:["sam-gov's watch mode is none, so nothing goes back to the source looking for changes. The free list-diff signal still runs, the discovery digest picks up every sam-gov cluster first seen today, and the sentinel checks that each phase actually ran."],cells:[{label:null,paths:[],blocks:[],notes:["Then the tail. 2.89 renders a markdown pack per cluster. 2.9 to 2.95 rebuild the day-by-day monitor board and the all-portals overview page, both re-reading every sam-gov stats.json ever written. 3 to 4.99 produce the roll-up and the scorecard. The scorecard's number is the only YES total anyone may quote. Adding up per-portal scoring.yes values is explicitly forbidden, because clustering merges bids across portals and the sum would double-count."],tables:[[{header:!1,cells:["Watch mode none","no source re-capture for this portal"]},{header:!1,cells:["Free list-diff signal","runs"]},{header:!1,cells:["Discovery and watch digests, deadline alerts","dead until RESEND_API_KEY is set in data/auth/resend.env"]},{header:!1,cells:["Sentinel","writes data/portals/sentinel.json; sam-gov read healthy on 14 July"]}]]}],notes:[],then:null}],l=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["Two mandatory stages have no code. The enriched triage input and the SKIP audit are both written by hand by a child agent. Grep the repo for triage-enriched or skip-audit and you get nothing.","On 28 July the SKIP audit rescued 7 real bids out of 64 rejects, one in nine. A night where the agent skips the step loses those seven silently. Nothing warns."]},{header:!1,cells:["A whole stage ran that the model does not know about. carry-audit-input.json and carry-audit-out.json were written on 28 July. docs/portal-dataflow/sam-gov.md has no stage for them.","Two old rejects were overturned, one to MAYBE 50 and one to YES 70. The model document is stale. Trust the files."]},{header:!1,cells:["The runs/ folder has no dates in its filenames, and only three files get cleared. Prep blanks triage-verdicts, judge-verdicts and judge-input-open. Everything an agent writes stays.","Two generations sit side by side. t28-batch-* (99 rows) is this run; triage-batch-{0..4}-* (213 rows) is an older one. j28-batch-* (42 rows) is this run; judge-batch-{0..3}-* (61 rows) is older. skip-audit-out.json, skip-audit.json and triage-enriched.json share zero bids with this run's 99. Anyone reading runs/ without checking dates will read the wrong night."]},{header:!1,cells:["verdicts.json is cumulative, not nightly. 131 rows on a night when only 99 bids were new and only 46 were judged.",`Quoting "131 scored on 28 July" is wrong. 85 of those rows are older verdicts copied forward. Bid B's 88 is a 24 July verdict wearing a 28 July date.`]},{header:!1,cells:["The board card drops the contact. All 406 bids carry an officer name and email from the very first API reply, and 259 of them carry a phone too. All 208 sam-gov cards in portal-bids.json have contact_email: null.","The operator reading the card cannot see who to call. A later shared pass is meant to lift the contact out of the description into database columns; that is outside what this page can check from disk, but the fixture itself is empty."]},{header:!1,cells:['PORTAL.md is a stale auto-generated draft. Dated 14 July, every field-map row still says TODO, health "last swept 2026-07-13".','It says batch standalone; the registry says portals. It says "enrich passes: none"; five shared passes run nightly. It says "uses an LGS login" with detection discipline; in truth this is a Bearer key sent as a header, with no browser session and no login to burn. The real risk is a spent request budget, not detection.']},{header:!1,cells:["Four documents disagree about which batch this portal is in. The registry and the portals runbook say Batch I. config.json and PORTAL.md say standalone. The sam-gov sweep skill contradicts itself in two lines of the same file.","The registry wins, because that is the file the code reads. Three documents will still mislead whoever reads them first."]},{header:!1,cells:["Compile merges runs/judge-verdicts.json without checking it belongs to tonight. Prior-day verdicts are filtered to bids still in the snapshot; this run's file is not.","If the judge is never dispatched, yesterday's verdicts file gets merged into today's archive as if it were fresh. Prep now blanks the file at the start of every run, which closes the common case. Not observed live on sam-gov."]},{header:!1,cells:["An older, second code path still exists. engine/connectors/api/sam_gov.py (10,841 bytes, dated 6 May) hits the raw api.sam.gov endpoint with a different key, and PORTAL.md lists it as one of the files that drive this portal.","Nothing in the nightly flow calls it. Dead or parked, but a reader will think it is live."]},{header:!1,cells:["Known walls. 1,000 requests an hour on the $19-a-month plan; a long retry delay means the budget is spent and the engine stops rather than burning more. Cloudflare blocks the default request agent, so a browser user-agent is required. The terms forbid pulling the whole dataset, so only a filtered query is allowed: one code query plus 21 word searches on 28 July.",'These are hard limits, not bugs. A zero-row pull never overwrites a healthy snapshot, so a blocked night degrades to "no new bids" instead of an empty board.']},{header:!1,cells:["Federal contamination watch is on by design. Every record is stamped federal: true and carries a federal red flag.","The repo's default rule bans federal feeds. This one was switched on by explicit operator decision on 25 June 2026. Nothing from it is ever auto-accepted; the industry-code list is the main guard against junk."]},{header:!1,cells:["The model document's volume line is out of date. It cites 413 open biddable out of about 10,900, measured 24 July.","On 28 July it was 406 open biddable out of 2,714 raw records across both nets. Use the numbers on this page."]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to data/sam-gov/daily/2026-07-28/stats.json, a row count, a byte size, or data/sam-gov/logs/pull_log.txt. Baseline map: docs/portal-dataflow/sam-gov.md (evidence-cited to file:line), with the gaps between that document and the files named above. Companion pages: Portal pedia · 01 (BidNet), · 02 (DemandStar)."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to data/sam-gov/daily/2026-07-28/stats.json, a row count, a byte size, or data/sam-gov/logs/pull_log.txt. Baseline map: docs/portal-dataflow/sam-gov.md (evidence-cited to file:line), with the gaps between that document and the files named above. Companion pages: Portal pedia · 01 (BidNet), · 02 (DemandStar).",c="docs/portal-dataflow/pedia-sam-gov.html",u={slug:e,title:t,eyebrow:a,headline:s,lede:n,funnel:o,funnel_note:i,legend:r,stages:d,sections:l,footer:h,source_page:c};export{u as default,a as eyebrow,h as footer,o as funnel,i as funnel_note,s as headline,n as lede,r as legend,l as sections,e as slug,c as source_page,d as stages,t as title};
