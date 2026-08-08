const e="ms-mdot-letting",t="Mississippi DOT Proposed Letting: what happens to a bid, stage by stage",s="Portal pedia · 28",n="Mississippi DOT: the night nothing scored YES",a="Every stage of one run of the Mississippi DOT Proposed Letting sweep, with a real record read off disk at each step. All data is from the run of 28 July 2026. 211 bids in the snapshot, 10 of them new. The judge ran once and said no. Final score for the night: 0 yes, 1 maybe, 16 no.",o=[{value:"211",label:"in snapshot"},{value:"201",label:"carried over"},{value:"10",label:"new tonight"},{value:"17",label:"open (all time)"},{value:"0",label:"yes"},{value:"1",label:"maybe"},{value:"16",label:"no"}],i="Every number above is from data/ms-mdot-letting/daily/2026-07-28/stats.json (513 bytes). Read the middle three carefully. The 17 open and 194 skip add up to 211, which is the whole archive, not tonight. Tonight's own Pass 1 wrote just 10 rows (runs/triage-verdicts.json, 2,382 bytes): 1 open, 9 skip. Same for the scores. The 0 / 1 / 16 covers 17 bids, but only one bid was actually judged tonight (runs/judge-verdicts.json, 1,688 bytes, 1 row). The other 16 verdicts were written on earlier days and copied forward.",r=["Bid A · mdot-108287302 · Bank Stabilization, Attala County. Sits on the watchlist and never moves.","Bid B · mdot-100881301 · Bridge Replacement, Simpson County. Ends as MAYBE at score 42."],l=[{n:"0",title:"Is it this portal's turn tonight?",who:"scripts/portal_due.py --batch portals",summary:["This portal is not swept every day. It runs every third day. The gate looks at the newest dated folder under data/ms-mdot-letting/daily/, checks how old it is, and prints the slug only if the portal is due. A slug that is not printed is never dispatched.","There are 22 dated folders on record. The one before this run was 23 July 2026, five days earlier, so the portal was due."],cells:[{label:"In",paths:[{path:"data/portals/registry.json",size:"the offline fallback"},{path:"supabase.portals",size:"the live cadence value, edited from the PortalPro matrix"},{path:"data/ms-mdot-letting/daily/",size:"22 folders named YYYY-MM-DD"},{path:"the slug, printed once, to stdout",size:null}],blocks:[],notes:[],tables:[]},{label:"Real record · the portal's registry entry",paths:[],blocks:[`{
 "slug": "ms-mdot-letting",
 "label": "Mississippi DOT — Proposed Letting",
 "engine": "mdot_proposed",
 "batch": "portals",
 "cadence_days": 3,
 "authed": false,
 "enrich_passes": [],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:["Four of these fields decide what the portal does and does not get later: no login, no enrichment pass, no watch, and a carry-forward that the shared script deliberately skips. Stage 15 explains that last one."],tables:[]}],notes:[],then:"the orchestrator hands the whole portal to one child agent"},{n:"1",title:"Hand it to a child agent",who:"Agent(general-purpose) reading .claude/skills/ms-mdot-letting-sweep/SKILL.md",summary:["The nightly orchestrator sends batch G as one message of five parallel agent calls and waits for all five. This portal shares that batch with caleprocure, commbuys, nc-wilmington and civcast. The child owns the portal from here to the daily archive and returns a short summary.","If this portal fails, the batch is not held. It is noted and the run continues."],cells:[{label:"Why a child agent and not a plain script",paths:[],blocks:[],notes:["Two steps in this portal's run have no script behind them. Pass 1 is a rule the agent applies by hand (stage 8), and the promotion of a watchlist project to an advertised one is something the agent has to notice (stage 9). Both write data/ms-mdot-letting/runs/triage-verdicts.json directly. Nothing in the shared machinery does either job."],tables:[]}],notes:[],then:"the pull opens three separate public surfaces"},{n:"2",title:"Layer 1: the letting that is actually advertised",who:"data/ms-mdot-letting/scripts/run_daily.py · step 1 · open folders/_lib/engines/mdot_lettinginfo.py",summary:["First it finds which lettings MDOT is advertising right now, then opens each letting page and reads one row per call: the full written scope, the county, the route, the project numbers, the proposal PDF link and any addenda.","This is the only layer that carries a real bid date. On this night it returned one row: the August 25, 2026 letting, one call."],cells:[{label:"In",paths:[{path:"https://mdot.ms.gov/bidsystem_data/letting.xml",size:null},{path:"https://mdot.ms.gov/applications/bidsystem/currentletting.aspx",size:null},{path:"https://mdot.ms.gov/applications/bidsystem/LettingInfo.aspx?r=0&date={Month D, YYYY}",size:null},{path:"1 advertised row, held in memory",size:"tagged _source_listing: advertised_letting"}],blocks:[],notes:["Two traps live in this layer. MDOT serves its pages as Windows-1252 with no charset declared, so the reader forces that encoding or names like D'Iberville come out mangled. And control_id is keyed to the proposal PDF filename, not to the project number written in the prose, because on a multi-segment call the prose names a different project."],tables:[]},{label:"Real record the only advertised call tonight",paths:[],blocks:[`{
 "bid_id": "mdot-108168301",
 "title": "Letting August 25, 2026 — Add 2
 Lanes to I-55 · Madison · I-55",
 "buyer": "Mississippi Department of
 Transportation (MDOT)",
 "status": "Advertised letting August 25, 2026",
 "due_date": "2026-08-25",
 "county": "Madison",
 "route": "I-55",
 "work_type": "Add 2 Lanes to I-55",
 "control_id": "108168301",
 "federal_project_no": "s",
 "call_no": "1",
 "proposal_pages": 398,
 "has_item_schedule": true,
 "documents": [
 {"name": "Proposal 108168301",
 "url": "https://mdot.ms.gov/bidsystem_data/
 20260825/PROPOSALS/108168301000.pdf",
 "type": "pdf"}
 ],
 "_source_listing": "advertised_letting"
}`],notes:['Look at federal_project_no. It is the single letter "s". The parser took one character out of the page instead of a project number, and nothing checks it.'],tables:[]}],notes:[],then:"each advertised call gets its proposal packet downloaded and read"},{n:"3",title:"Layer 1b: read the whole proposal packet",who:"open folders/_lib/engines/mdot_proposal_pdf.py · extract_scope, once per call",summary:['This is the step that makes this portal worth having. MDOT titles are useless on their own. A job called "Thin Lift" or "Overlay" can hide pages of tree clearing on the road edge. So the packet is downloaded whole, every page of text is pulled out, and the real scope plus any LGS work words plus the pay-item list are lifted from it.',"Packets run 100 to 400 pages and the useful part sits at the end, so nothing is capped. The first read of a 261-page packet takes about a hundred seconds. The result is then cached on disk by control number, so the next run costs nothing."],cells:[{label:"In → Out",paths:[{path:"https://mdot.ms.gov/bidsystem_data/{YYYYMMDD}/PROPOSALS/{control}.pdf",size:null},{path:"data/ms-mdot-letting/cache/proposals/{control}.json",size:"23 packets cached on disk today"}],blocks:[],notes:["A broken packet is cached too. If the download or the read fails, an empty result is stored rather than raised, so the same broken file is not fetched again every run. That is deliberate, but it also means a bad first read sticks.","The word list it scans for: clearing, grubbing, tree, stump, removal, vegetation, mowing, brush, debris, herbicide, seeding, erosion, slope, mulch, right of way."],tables:[]},{label:"Real record Bid B · cache/proposals/100881301.json",paths:[],blocks:[`{
 "control_id": "100881301",
 "pdf_url": "https://mdot.ms.gov/bidsystem_data/
 20260728/PROPOSALS/100881301000.pdf",
 "sha1": "9f4349af60958b6238f557f9bb5550…",
 "pages": 239,
 "scope_detail": "STBG-0013-02(034) / 100881301 &
 BR-0013-02(029) / 106971301 in Simpson County.
 LGS items: #757 Additional Erosion Control
 Requirements | #1434 Erosion Control Plan |
 #4699 Right-of-Way Plat | #7304 Erosion Control
 Contract Compliance | #8189 Removal of
 Obstructions | 907-107-2 Contractor's Erosion
 Control Plan",
 "lgs_signals": ["clearing", "debris", "erosion",
 "grubbing", "mowing", "mulch", "removal",
 "right of way", "seeding", "slope",
 "tree", "vegetation"],
 "has_item_schedule": true,
 "text_excerpt": "MDOT Use Only\\nChecked\\nLoaded\\n
 Keyed\\nPROPOSAL AND CONTRACT\\nDOCUMENTS\\n…
 Bridge Replacement on SR 28 between Copiah
 County Line & Pinola (Bridge Nos. 72.7 &
 73.6) & over Tanyard Creek (Bridge No. 77.6)…"
}`],notes:["One line in that scope, #8189 Removal of Obstructions, is the entire reason Bid B ends as a maybe five stages later. Nothing else in 239 pages says what it removes."],tables:[]}],notes:[],then:"then the year-ahead grid, which is most of the file"},{n:"4",title:"Layer 2: the watchlist, a year of planned work",who:"open folders/_lib/engines/mdot_proposed.py · _pull_proposed_grid",summary:["MDOT publishes a grid of everything it plans to put out to bid over the next year. One thin row per project: work type, county, route, one line of description. No date, no packet, no documents. On this night that grid gave 205 rows spread across eleven letting periods, from 2026 / 07 out to 2027 / 06.","This is radar, not a bid list. A project already advertised in Layer 1 is dropped here so the rich record wins."],cells:[{label:"In → Out",paths:[{path:"https://mdot.ms.gov/applications/Schedule_of_Proposed_Projects/ProposedLetting.aspx",size:null},{path:"205 thin rows, held in memory",size:"tagged _source_listing: proposed_schedule"}],blocks:[],notes:["Why there is never a date here. The firm bid date lives inside AASHTOWare Bid Express, which needs an account. This portal runs with no login, so due_date stays empty on all 205 rows. A side effect: these rows can never expire on a date. They leave only when MDOT takes them off the grid."],tables:[]},{label:"Real record Bid A · from bids/all-bids.json",paths:[],blocks:[`{
 "bid_id": "mdot-108287302",
 "title": "Letting 2026 / 07 — Bank
 Stabilization · Attala · MS 12",
 "buyer": "Mississippi Department of
 Transportation (MDOT)",
 "status": "Proposed letting 2026 / 07
 (future schedule)",
 "due_date": null,
 "due_date_raw": "",
 "posting_date": null,
 "state": "MS",
 "county": "Attala",
 "district": "District 2",
 "route": "MS 12",
 "work_type": "Bank Stabilization",
 "letting": "2026 / 07",
 "control_id": "108287/302000",
 "federal_project_no": "STP-0018-02(057)",
 "related_control": "108287/301000",
 "description": "Bank Stabilization. SR 12
 over Big Black River (83.4)",
 "documents": [],
 "_detail_ok": true,
 "_source_listing": "proposed_schedule"
}`],notes:["That is Bid A's whole life. One line of description, no date, no documents. It looks exactly the same tonight as it did weeks ago, and that is why it never moves."],tables:[]}],notes:[],then:"and a third feed, for city and county jobs"},{n:"5",title:"Layer 3: the local agency feed",who:"open folders/_lib/engines/mdot_lpa.py · pull_lpa",summary:["A public data feed of construction work that towns and counties run with MDOT money. Small jobs, each with a written scope, a dollar range and a direct advertisement PDF. The buyer here is the town, not MDOT. On this night: 5 rows.","These are more likely than state paving to carry clearing or tree work, which is why the layer exists at all."],cells:[{label:"In → Out",paths:[{path:"https://mdot.ms.gov/odata/t_lpa_project",size:null},{path:"5 rows, held in memory",size:"tagged _source_listing: lpa"}],blocks:[],notes:["This row is the only new work tonight. It is the one bid out of 211 that reaches the judge. Note _pdf_mined: page one of the advertisement was a scan with no text in it, so it was re-rendered at 170 dots per inch and read off the picture.","A dead feed returns nothing and the other two layers still stand. One bad row is skipped, never raised."],tables:[]},{label:"Real record · the new LPA bid",paths:[],blocks:[`{
 "bid_id": "mdot-lpa-109923-701000",
 "title": "City of Picayune - MS 43 from US 11
 to Highland Parkway - Pedestrian Improvements
 - Pearl River County",
 "buyer": "City of Picayune",
 "county": "Pearl_River",
 "value_range": "$500,000.00 - $985,000.00",
 "status": "LPA advertisement",
 "due_date": "2026-09-10",
 "proposal_pages": 2,
 "lgs_signals": ["sodding", "erosion control",
 "earthwork and grading",
 "concrete driveway removal"],
 "documents": [
 {"name": "Advertisement",
 "url": "https://mdot.ms.gov/documents/LPA/
 Project%20Advertisements/Advertisement%20-
 %20109923-701000%20City%20of%20Picayune.pdf",
 "type": "pdf"}
 ],
 "description": "City of Picayune - MS 43 from US 11
 to Highland Parkway… The work shall consist
 essentially of the following items: New sidewalk
 construction and improvements from US Hwy. 11 to
 Highland Parkway to include minor earthwork and
 grading, existing concrete driveway removal and
 replacement, new 5' wide concrete sidewalk,
 sodding, and erosion control…",
 "_source_listing": "lpa",
 "_pdf_mined": "LPA advertisement PDF (2 pages);
 p1 is a scanned image with no text layer -
 transcribed from a 170dpi render"
}`],notes:[],tables:[]}],notes:[],then:"three layers become one file"},{n:"6",title:"Merge into one snapshot",who:"end of mdot_proposed.pull → open folders/_lib/common.py",summary:["The three layers are stacked in order, advertised first, then the grid, then the local feed. Duplicate ids are dropped with the first one winning, so a rich advertised record always beats the thin grid record for the same project. Then it is written to disk with a count per layer."],cells:[{label:"Out",paths:[{path:"data/ms-mdot-letting/bids/all-bids.json",size:"217,367 bytes · 211 rows"},{path:"data/ms-mdot-letting/bids/index.json",size:"804 bytes"},{path:"data/ms-mdot-letting/logs/pull_log.txt",size:null}],blocks:[],notes:['Six rows out of 211 carry anything to act on. Only 6 rows have a document, and the same 6 have a due date: the one advertised call plus the five local agency jobs. The other 205 are watchlist radar with no date, no packet and one line of text. That is the design, not a hole. But it does mean any count of "bids pulled" for this portal is 97 percent radar.'],tables:[]},{label:"Real record · bids/index.json, whole file",paths:[],blocks:[`{
 "generated_at": "2026-07-28T21:23:59.295456+00:00",
 "snapshot_total": 211,
 "source": "ms-mdot-letting",
 "engine": "mdot_proposed",
 "endpoint": "https://mdot.ms.gov/applications/
 Schedule_of_Proposed_Projects/ProposedLetting.aspx",
 "layers": {
 "advertised_letting": 1,
 "proposed_schedule": 205,
 "lpa": 5
 },
 "advertised_lettings": [
 {"date": "2026-08-25",
 "label": "August 25, 2026",
 "calls": 1}
 ],
 "proposed_schedule_lettings": {
 "2026 / 07": 17, "2026 / 08": 17,
 "2026 / 09": 33, "2026 / 10": 27,
 "2026 / 11": 14, "2027 / 01": 34,
 "2027 / 02": 15, "2027 / 03": 5,
 "2027 / 04": 15, "2027 / 05": 14,
 "2027 / 06": 14
 },
 "skipped_malformed": 0,
 "open_total": 211
}`],notes:["Eleven letting periods across a twelve-month window. There is no 2026 / 12 row in the grid at all."],tables:[]}],notes:[],then:"compare against last time, keep only what is genuinely new"},{n:"7",title:"What is new tonight",who:"data/ms-mdot-letting/scripts/run_daily.py · step 2 · ps.prep",summary:["Tonight's snapshot is compared against the most recent daily archive. Any id that has been seen before goes straight to the carryover file with its old decision copied word for word. Only genuinely new ids go to the triage file. A separate judge file is built for every bid in the snapshot, new or not.","The last archive held 206 ids. Tonight there are 211. 201 of them match, so 10 are new and 5 old ones have dropped off the grid."],cells:[{label:"Out · four files",paths:[{path:"runs/triage-input.json",size:"2,535 bytes · 10 rows"},{path:"runs/triage-carryover.json",size:"34,871 bytes · 201 rows"},{path:"runs/judge-input.json",size:"159,254 bytes · 211 rows"},{path:"runs/_funnel.json",size:"156 bytes"}],blocks:[`{"idx": 5, "bid_id": "mdot-lpa-109923-701000",
 "title": "City of Picayune - MS 43 from US 11 to
 Highland Parkway - Pedestrian Improvements -
 Pearl River County",
 "buyer": "City of Picayune", "state": "MS",
 "due_date": null}

{"idx": 175, "bid_id": "mdot-310414031",
 "title": "Letting 2027 / 04 — Micro Surface ·
 Noxubee · MS 852",
 "buyer": "Mississippi Department of
 Transportation (MDOT)", "state": "MS",
 "due_date": null}`],notes:[],tables:[]},{label:"Both tracers land in carryover, not triage Bid ABid B",paths:[],blocks:[`{
 "bid_id": "mdot-108287302",
 "decision": "SKIP",
 "reason": "awaiting proposal PDF
 (future-schedule watchlist); MDOT judged
 from PDF, not title"
}`,`{
 "bid_id": "mdot-100881301",
 "decision": "OPEN",
 "reason": "proposal PDF now posted (promoted
 from future-schedule watchlist); judged from
 mined PDF description"
}`],notes:["Neither tracer is in tonight's triage file. Both were seen on earlier days, so both were copied forward with their old answers untouched. That copy is what makes this portal cheap to run, and it is also what makes an old wrong answer permanent. Stage 9 is where that bites."],tables:[]}],notes:[],then:"the 10 new bids meet a rule, not an AI"},{n:"8",title:"Pass 1: a rule with no AI in it",who:"child agent writes runs/triage-verdicts.json · rule: OPEN if the bid has documents, else SKIP",summary:["On most portals Pass 1 is an AI reading titles. Here it is a plain rule, because MDOT titles lie. A bid with a proposal PDF attached is OPEN and will be judged from the mined packet text. A bid with no documents is SKIP with the reason written out.","Tonight that rule produced 1 OPEN and 9 SKIP across the 10 new bids. The one OPEN is the City of Picayune sidewalk job from Layer 3."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"10 rows"},{path:"bids/all-bids.json",size:"to check the documents field"},{path:"runs/triage-verdicts.json",size:"2,382 bytes · 10 rows"}],blocks:[],notes:[`Why the rule exists. A job titled "Overlay" on Lawrence County MS 587 turned out to carry a real instruction to clear every tree on the right of way and trim limbs to about 70 feet. It scored 76 and became this portal's only yes ever. A title reader would have thrown it away.`],tables:[]},{label:"Real records · the only OPEN, and one of the nine SKIPs",paths:[],blocks:[`{
 "bid_id": "mdot-lpa-109923-701000",
 "title": "City of Picayune - MS 43 from US 11
 to Highland Parkway - Pedestrian Improvements
 - Pearl River County",
 "decision": "OPEN",
 "reason": "PDF-backed (1 doc(s)); judged from
 mined proposal scope, not title"
}`,`{
 "bid_id": "mdot-310415301",
 "title": "Letting 2027 / 04 — Scrub Seal &
 Micro · Noxubee · MS 388",
 "decision": "SKIP",
 "reason": "awaiting proposal PDF (watchlist);
 judged from PDF when posted"
}`],notes:["All nine SKIPs are 2027 grid rows with the same reason. Nine of the ten new bids are work MDOT will not advertise for another eight months."],tables:[]}],notes:[],then:"and then the step no script performs"},{n:"9",title:"Promotion: watchlist to advertised",who:"the child agent rewrites runs/triage-verdicts.json by hand",summary:["When MDOT finally posts a project's proposal PDF, that project moves from the thin grid into the rich advertised layer keeping the same id. Its old SKIP has to flip to OPEN or the newly-readable packet is never judged.","Nothing in the shared machinery does that flip. The prep step files an already-seen id into carryover with its old answer word for word, and the judge queue only looks at carryover rows that already say OPEN. A SKIP is never re-examined by any script. If the child agent does not notice, the promotion does not happen."],cells:[{label:"Bid A · still waiting Bid A",paths:[],blocks:[`{
 "bid_id": "mdot-108287302",
 "decision": "SKIP",
 "reason": "awaiting proposal PDF
 (future-schedule watchlist); MDOT judged
 from PDF, not title"
}`],notes:["From daily/2026-07-28/triage.json, 37,250 bytes, 211 rows: 17 OPEN, 194 SKIP."],tables:[]},{label:"Bid B · promoted on an earlier day, still OPEN tonight Bid B",paths:[],blocks:[`{
 "bid_id": "mdot-100881301",
 "decision": "OPEN",
 "reason": "proposal PDF now posted (promoted
 from future-schedule watchlist); judged from
 mined PDF description"
}`],notes:["The flip is sticky in both directions. 17 bids say OPEN tonight, but only 6 of them still have a document in the snapshot. The other 11 were advertised in July, were judged then, and have since fallen back to bare grid rows with no packet and no date. They keep the word OPEN forever because no script ever looks at a decision twice."],tables:[]}],notes:[],then:"the enrichment step, which does nothing here"},{n:"10",title:"Enrich the OPENs: nothing to do",who:"ps.enrich_opens(PORTAL, config, open_ids)",summary:["The shared step looks for an enrichment function on the engine. This engine does not have one, so it returns zero and moves on. The registry agrees: enrich_passes is an empty list.","That is not a gap. The enrichment other portals do at this point already happened at stage 3, when the whole proposal packet was read."],cells:[{label:"In",paths:[{path:"runs/triage-verdicts.json",size:null}],blocks:[],notes:[],tables:[]},{label:"Out",paths:[{path:"nothing · the number 0",size:null}],blocks:[],notes:[],tables:[]}],notes:[],then:"who still needs a verdict?"},{n:"11",title:"Build the judge queue",who:"ps.build_judge_input_open(PORTAL)",summary:["This collects the bids that still need a score: tonight's OPENs, plus any carried-over OPEN that has never been judged at all. It re-reads the snapshot so the judge sees the newest description.","17 bids say OPEN. One ends up in the queue. The other 16 already have a verdict from an earlier night, so they are left alone."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json + runs/triage-carryover.json",size:null},{path:"daily/*/verdicts.json",size:"who has already been judged"},{path:"runs/judge-input-open.json",size:"2,449 bytes · 1 row"}],blocks:[],notes:[`The gap this leaves. Tonight's only advertised call, mdot-108168301, is not in this queue. It was judged once on 6 July, when that same project sat in the July 28 letting, and marked no. It has since moved to the August 25 letting and its document link now points at the 20260825 packet — but the mined scope on record is still the old one: cache/proposals/108168301.json holds pdf_url ending 20260728/PROPOSALS/108168301000.pdf. The packet cache is keyed on the control number alone, so a project that gets re-let is never re-read. "Already judged" and "judged on the packet in front of us" are not the same thing, and nothing here can tell them apart.`],tables:[]},{label:"Real record · the whole queue, one row",paths:[],blocks:[`{
 "idx": 5,
 "bid_id": "mdot-lpa-109923-701000",
 "title": "City of Picayune - MS 43 from US 11
 to Highland Parkway - Pedestrian Improvements
 - Pearl River County",
 "buyer": "City of Picayune",
 "state": "MS",
 "due_date": "2026-09-10",
 "detail_url": "https://mdot.ms.gov/documents/LPA/
 Project%20Advertisements/Advertisement%20-
 %20109923-701000%20City%20of%20Picayune.pdf",
 "description_full": "Title: City of Picayune…
 Closes: 2026-09-10
 …
 RFP body:
 …The work shall consist essentially of the
 following items: New sidewalk construction and
 improvements from US Hwy. 11 to Highland Parkway
 to include minor earthwork and grading, existing
 concrete driveway removal and replacement, new
 5' wide concrete sidewalk, sodding, and erosion
 control… Bid security 5% cashier's/certified
 check or bidder's bond; Performance and Payment
 Bonds each 100% of contract amount…
 LGS items: sodding | erosion control | minor
 earthwork and grading | existing concrete
 driveway removal and replacement."
}`],notes:['The same bid has "due_date": null in triage-input.json and "2026-09-10" here. This step re-reads the snapshot, and by then the date had been mined out of the PDF.'],tables:[]}],notes:[],then:"one bid, one AI call"},{n:"12",title:"Pass 2: the judge says no",who:"max-bid-judge · AI → the child agent writes runs/judge-verdicts.json",summary:["The judge reads the mined advertisement and answers yes, maybe or no with a score out of 100 and its reasoning. It writes nothing itself. The child agent writes the file.","The verdict: no, score 10. The job is pouring concrete sidewalk. The sodding and erosion control are side items, and the earthwork is called minor in the advertisement itself."],cells:[{label:"In → Out",paths:[{path:"runs/judge-input-open.json",size:"1 row"},{path:"runs/judge-verdicts.json",size:"1,688 bytes · 1 row"}],blocks:[],notes:["That is the whole AI cost of the night. One judge call on one bid. Pass 1 used no AI at all. 210 of the 211 bids in the snapshot cost nothing beyond being read.","The AI runs read-only. If it returns a row shape the compiler does not recognise, the shape is repaired at the moment of writing so the score, the label and the reason can never disagree."],tables:[]},{label:"Real record · the only verdict written tonight",paths:[],blocks:[`{
 "bid_id": "mdot-lpa-109923-701000",
 "title": "City of Picayune - MS 43 from US 11
 to Highland Parkway - Pedestrian Improvements
 - Pearl River County",
 "would_lgs_bid": "no",
 "score": 10,
 "primary_reason": "The advertisement's scope is
 concrete construction: 'New sidewalk construction
 and improvements from US Hwy. 11 to Highland
 Parkway to include minor earthwork and grading,
 existing concrete driveway removal and
 replacement, new 5' wide concrete sidewalk,
 sodding, and erosion control.' That is the
 explicit non-fit line in the book - LGS clears
 vegetation, it does not pour concrete or build
 pavement…",
 "service_match": "non-fit",
 "scale_match": "unknown",
 "buyer_match": "core",
 "red_flags": [
 "construction_rfp_concrete_sidewalk",
 "prime_scope_is_paving_not_vegetation",
 "federal_aid_wage_rates_and_100pct_bonds",
 "sodding_and_erosion_control_are_
 incidental_line_items",
 "plans_must_be_purchased_to_be_on_
 planholders_list"
 ],
 "fit_signals": [
 "core_state_mississippi",
 "city_buyer_type_seen_in_win_column",
 "incidental_sodding_and_erosion_control_
 line_items"
 ],
 "kansas_city_risk": false,
 "closed_award": false,
 "_first_judged": "2026-07-28",
 "_judged_from": "mined LPA advertisement PDF
 (2 pages; p1 scanned image transcribed from
 render), not title"
}`],notes:[],tables:[]}],notes:[],then:"tonight's answer is merged with every answer still live"},{n:"13",title:"Compile the daily archive",who:"ps.compile_archive(PORTAL, config)",summary:["Carryover and new triage are merged, tonight's one verdict is laid on top of yesterday's still-live ones, and five files are written into a dated folder. This step can be re-run safely.","The verdicts file is cumulative. It holds 17 rows, one for every bid still marked OPEN and still present in tonight's snapshot. Twelve of them were first judged on 6 July, one on 23 July, one tonight, and three carry no judged-on date at all."],cells:[{label:"Out · data/ms-mdot-letting/daily/2026-07-28/",paths:[],blocks:[],notes:['The file name lies a little. new-bids.json holds all 211 rows, not the 10 new ones. Anyone counting "new bids" off that file for this portal counts the whole snapshot.'],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","211 rows, the full snapshot","217,367 B"]},{header:!1,cells:["triage.json","211 decisions: 17 OPEN, 194 SKIP","37,250 B"]},{header:!1,cells:["verdicts.json","17 verdicts, only 1 written tonight","17,386 B"]},{header:!1,cells:["stats.json","the funnel counts at the top of this page","513 B"]},{header:!1,cells:["report.md","the human summary","946 B"]}]]},{label:"Real records · Bid B, and tonight's advertised call Bid B",paths:[],blocks:[`{
 "bid_id": "mdot-100881301",
 "title": "Letting July 28, 2026 — Bridge
 Replacement · Simpson · SR 28",
 "would_lgs_bid": "maybe",
 "score": 42,
 "reasoning": "Alongside the usual erosion-control
 boilerplate, this letting carries \\"#8189 Removal
 of Obstructions\\" — a pay item the mined text
 doesn't describe further, so it's genuinely
 unclear whether it covers structural/creek-
 crossing obstructions or ROW vegetation clearing
 tied to the Tanyard Creek bridge work. That
 ambiguity, not a confident vegetation read, is
 the basis for surfacing this as MAYBE for a
 packet pull.",
 "red_flags": [
 "confirm_item_8189_vegetation_vs_structural",
 "bid_submission_needs_aashtoware_account"
 ],
 "_first_judged": "2026-07-06",
 "verdict": "maybe",
 "lgs_score": 42
}`,`{
 "bid_id": "mdot-108168301",
 "title": "Letting July 28, 2026 — Add 2 Lanes
 to I-55 · Madison · I-55",
 "would_lgs_bid": "no",
 "score": 18,
 "reasoning": "Mined items are the same
 erosion-control/ROW-plat/video-equipment
 boilerplate seen across this letting batch, with
 no measured tree/vegetation clearing item
 surfaced. A genuine lane-add widening job of this
 size often carries real ROW clearing scope not
 captured by this extraction pass, so flag for the
 operator to pull the full AASHTOWare packet
 before ruling out.",
 "_first_judged": "2026-07-06"
}`],notes:['Both titles say July 28, 2026. The snapshot does not. In all-bids.json tonight these same two bids are called "Letting 2026 / 07 — Bridge Replacement · Simpson · MS 28" and "Letting August 25, 2026 — Add 2 Lanes to I-55 · Madison · I-55". A verdict keeps the title it was born with. A report built off verdicts shows the old name.'],tables:[]}],notes:[],then:"one more file exists, written by nobody in the nightly run"},{n:"14",title:"The local preview page",who:"data/ms-mdot-letting/scripts/build_bids_view.py · off-sequence",summary:["A hand-built page that renders the snapshot into one HTML file grouped by the three layers, with a coverage bar per bid. It was written during onboarding and no phase of the nightly run calls it. It is modelled here only so the file it produces has a named author."],cells:[{label:"In → Out",paths:[{path:"bids/all-bids.json + runs/judge-verdicts.json → data/ms-mdot-letting/mdot-bids-view.html",size:null}],blocks:[],notes:[`Two reasons not to trust it. Its header is hardcoded to 2026-06-20 and says "data to Supabase not pushed (local preview)". And it reads runs/judge-verdicts.json, which holds only the last run's verdicts. Rebuilt tonight it would show exactly one verdict for the whole portal, not 17. Its own source file states the field wall plainly: MDOT proposals carry no contact block.`],tables:[]}],notes:[],then:"the portal's own night is over; the shared machinery takes over"},{n:"15",title:"Carry forward: skipped for this portal, on purpose",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:[`The shared safety net rescues verdicts for bids that fell out of one night's pull. It only walks portals whose registry setting is carry_forward: "orchestrator". This portal is set to "engine-internal", so the script never touches it. Running it as well would double-apply what the sweep already did at stages 7 and 13.`,"The proof is the empty space. The model for this portal lists _carryforward_audit.json as this stage's output. Tonight's folder holds five files and that is not one of them."],cells:[{label:"The two mechanisms are not the same thing",paths:[],blocks:[],notes:["That first row is not theory. This portal's only yes ever, mdot-109967301 at score 76, appears in the verdicts file of all 20 archive days from 20 June to 20 July 2026. It is in none from 23 July onward, and it is not in tonight's 211-row snapshot. It fell off the MDOT grid, so the engine-internal rule let its verdict go. The shared script would have kept it."],tables:[[{header:!0,cells:["","This portal (engine-internal)","The shared script (orchestrator)"]},{header:!1,cells:["bid missing from tonight's pull","verdict is dropped immediately","verdict is kept through the miss"]},{header:!1,cells:["age limit","none","90 days"]},{header:!1,cells:["closed or awarded check","none","yes"]}]]}],notes:[],then:"ledger, report, then the file the board reads"},{n:"16",title:"Ledger, report, and the fixture",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared steps in a row. The cumulative ledger walks every portal's daily verdicts and counts unique yes bids. The report step overwrites this portal's report.md with the shared layout, so the version compile wrote does not survive. The fixture step walks every day of this portal's archive, keeps the yes verdicts, and writes them into the file the board publisher reads.","Tonight's report is 946 bytes and its yes section says, in full, none. The one maybe is printed underneath it."],cells:[{label:"Out",paths:[{path:"data/portals/cumulative-yes.json + cumulative-yes.md",size:null},{path:"data/ms-mdot-letting/daily/2026-07-28/report.md",size:"946 bytes, rewritten"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"1 card for this portal"}],blocks:[],notes:[`Bid B's journey ends right here. The fixture step keeps verdict "yes" only. Maybe is kept for federal feeds and this is not one. So mdot-100881301, the best result of the night at score 42, is printed in the daily report and goes no further. It never reaches the board, and the operator only sees it if they open the report file.`],tables:[]},{label:"Real record · the only ms-mdot-letting card in the fixture",paths:[],blocks:[`{
 "id": "43570a2c49e2723c",
 "portal": "ms-mdot-letting",
 "source_bid_id": "mdot-109967301",
 "title": "Letting 2026 / 07 — Overlay ·
 Lawrence · MS 587",
 "buyer": "Mississippi Department of
 Transportation (MDOT)",
 "state": "MS",
 "solicitation_no": null,
 "score": 76,
 "verdict": "yes",
 "ai_reasoning": "Overlay on MS 587 but mined text
 carries a real clearing item beyond boilerplate:
 'All trees on MDOT right-of-way shall be cleared.
 Limbs shall be trimmed to a height of
 approximately 70' above ground at the edge of the
 clearing limits' — genuine measured ROW tree
 clearing/trimming, core LGS work.",
 "due_date": "",
 "contact_name": null,
 "contact_email": null,
 "contact_phone": null,
 "first_seen": "2026-06-20",
 "last_seen": "2026-07-20",
 "has_documents": true
}`],notes:["This card is a ghost. Read last_seen: 20 July. That bid is not in tonight's snapshot and not in any verdicts file since 23 July. The board still shows it because this step walks every dated folder in the archive, and the folders from June and mid-July still hold the yes. So the portal's tab shows one live-looking bid on a night when the portal produced none. Nothing on the card says the bid is gone."],tables:[]}],notes:[],then:"the bid stops being portal-shaped"},{n:"17",title:"Publish, cluster, dedupe",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["The fixture rows are pushed into the shared bids table, given a cluster id, and compared against every other portal's bids so one solicitation seen twice appears once. This is where the portal stops being its own thing. In practice, one row."],cells:[{label:"What this portal writes into the shared tables",paths:[],blocks:[],notes:["Two id shapes, one on purpose, one risky. An MDOT project is mdot- plus its nine-digit control number for both the advertised and the watchlist layer. That sameness is deliberate: a project promoted from watchlist to advertised keeps its identity. Local agency rows are mdot-lpa- plus the project number instead. Separately, a bid that is absent from the fixture can have its live board row deleted by the stale prune, so a portal that stops producing yes bids can lose its board presence quietly."],tables:[[{header:!0,cells:["Table","What lands there"]},{header:!1,cells:["portals","one row for this portal"]},{header:!1,cells:["bids","one row per portal and source id, from the fixture"]},{header:!1,cells:["sweep_runs","one row for this run date, built from stats.json"]},{header:!1,cells:["clusters","one row per cluster the bid joins"]}]]}],notes:[],then:"then the board tries to read the documents"},{n:"18",title:"Documents and requirements: the one that does not work",who:"2.85 run_enrichment_phase.py · 2.87 extract_doc_text.py → requirements-extractor → apply_requirements.py",summary:["This is the stage that turns a bid's documents into bond, insurance and licence pills on the board, quoting the packet word for word. For this portal it should be the best stage of all. We have already downloaded and read a 239-page and a 398-page proposal packet.","None of it arrives, and there are two separate reasons. The first is the key names. The MDOT engines write each document as name / url / type. On the night modelled here, publish_bid_documents.py read only file_name / file_url / file_path, found all three empty, and skipped the row. This is not an MDOT-only dialect: sc-sceis and tennessee-cpo write it too — this portal 6 listings, sc-sceis 2, tennessee-cpo 84, 92 in all, the same 92 counted in the scripts/document_link.py survey of all 47 portals' snapshots. A translator has since been written, read_doc in scripts/document_link.py, and it is wired into the publisher in the working tree. It has not run a night. docs/PROPOSED-CHANGES.md entry B1 records it as the one shelved change that would alter a real run, uncommitted and not approved.","The second reason outlives the first. The publisher only attaches a file to a bid that already has a board row — cluster_for(portal, bid_id) comes back empty and the row is skipped. Only yes bids are published, and this portal produced none tonight. So even with the key fix switched on, all six of tonight's document-bearing rows would attach to nothing."],cells:[{label:"What the engine writes",paths:[],blocks:[`{
 "name": "Proposal 108168301",
 "url": "https://mdot.ms.gov/bidsystem_data/
 20260825/PROPOSALS/108168301000.pdf",
 "type": "pdf"
}`],notes:["From tonight's all-bids.json. On the night modelled here the publisher read file_name, file_url, file_path. None of them exist in this dict, so it moved on. The shelved read_doc reads both spellings."],tables:[]},{label:"What it costs",paths:[],blocks:[],notes:["The runbook says document coverage is 100 percent. Both statements are true. That number counts rows whose documents field in the snapshot is not empty. It never checks whether the document reached the shared table. The key-name half of the fix is written and sitting on the shelf. The published-bid gate is not addressed at all."],tables:[[{header:!1,cells:["documents on the board","none reach bid_documents"]},{header:!1,cells:["requirements pills","no document row and, tonight, no cluster either, so nothing reaches the extractor"]},{header:!1,cells:["bid pack docs folder","stays empty"]},{header:!1,cells:["page text","only the universal fallback that renders the fields we already have"]}]]}],notes:[],then:"a second look at pairs that only now look alike"},{n:"19",title:"Dedupe again, after enrichment",who:"2.875 · llm_dedup_candidates.py → bid-dedup-judge (only if there are pairs) → apply_llm_dedup.py",summary:["Some duplicates only become visible once enrichment has filled in a buyer name, a closing date or a solicitation number. This second pass re-checks those. This portal's bids join the queue like everybody else's. If there are zero candidate pairs, no AI is dispatched at all.","Enrichment adds nothing for this portal, so a pair involving an MDOT bid looks the same here as it did at stage 17."],cells:[{label:"In → Out",paths:[{path:"supabase.clusters + supabase.dedup_adjudications → data/portals/llm-dedup-merges.json",size:null}],blocks:[],notes:[],tables:[]}],notes:[],then:"notice changes, send the mail, check the run"},{n:"20",title:"The last mile",who:"2.88 page text + signals · digests · 2.89 bid packs · 2.9 boards · 3 / 4 / 4.99 roll-up, scorecard, sentinel",summary:["Page text is stored, changes are turned into four operator emails, bid packs are built, the tracking boards are rebuilt from the archives, and the sentinel checks that every phase actually ran. For this portal most of these have little to carry tonight."],cells:[{label:null,paths:[],blocks:[],notes:[],tables:[[{header:!0,cells:["Step","What it does for this portal"]},{header:!1,cells:["page text store","the engine never writes a page-text field, so the only source is the universal fallback that re-renders the fields we already hold"]},{header:!1,cells:["watch signals",'registry watch: "none". No re-capture stage exists for this portal. Only the free list-level signals run.']},{header:!1,cells:["email digests","the markdown files are written either way, but the send is a silent no-op until an email key is set. None of the three digest files on disk — daily-new-bids.md, daily-watch-digest.md, contracts-digest.md — carries a single MDOT line."]},{header:!1,cells:["bid packs","a pack for an MDOT cluster gets its own page file, and an empty docs folder, for both reasons at stage 18"]},{header:!1,cells:["boards and roll-up","one row: pulled, new, open, yes, maybe per day, plus the standardized report inlined. A missing stats.json would mark the portal failed."]},{header:!1,cells:["scorecard","counts yes straight from the shared table. Never add up the per-portal stats files to get a yes total."]}]]}],notes:[],then:null}],d=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["205 of 211 rows are a watchlist with no date, no packet, no documents",'by design, not a gap. But only 6 rows have anything to act on, so any "bids pulled" figure for this portal is 97 percent radar']},{header:!1,cells:["The firm bid date lives behind an account wall","due_date stays empty on the whole watchlist layer, so those rows can never expire on a date. They leave only when MDOT drops them"]},{header:!1,cells:["A SKIP is never re-examined by any script",'the watchlist-to-advertised flip depends on the child agent noticing. A run that takes the "nothing new tonight" fast path literally promotes nobody, and a now-advertised project stays SKIP']},{header:!1,cells:["An OPEN is never re-examined either","17 bids say OPEN tonight; only 6 still have a document. Eleven rows carry a stale OPEN from July"]},{header:!1,cells:['"Already judged" beats "the packet changed"',"tonight's only advertised call was not re-judged. It carries a no written on 6 July, when the project sat in the July 28 letting. It has since moved to the August 25 letting, and the packet cache is keyed on the control number alone, so the new packet was never read either"]},{header:!1,cells:["Verdicts keep the title they were born with",'the report shows "Letting July 28, 2026" for bids the snapshot now calls "Letting 2026 / 07" and "Letting August 25, 2026"']},{header:!1,cells:["Documents are written as name / url / type; on this night the publisher read file_name / file_url / file_path","the same dialect sc-sceis and tennessee-cpo write — 92 listings across the three. A reader for both spellings (read_doc in scripts/document_link.py) is written and wired in the working tree but has never run: docs/PROPOSED-CHANGES.md B1, uncommitted and unapproved"]},{header:!1,cells:["A document only attaches to a bid that is already on the board",`the shared documents table is keyed by cluster, so publish_bid_documents.py looks the bid up in the bids table and skips it when there is no row. Only yes bids are published, so on a zero-yes night like this one there is nothing to attach to, whichever key names are used. Requirements pills and the bid pack docs folder stay empty. The runbook's "document coverage 100%" measures the snapshot field, not the table`]},{header:!1,cells:["Carry-forward is engine-internal, and it drops a verdict the moment a bid leaves the snapshot","this portal's only yes ever, mdot-109967301, vanished from the verdicts files after 20 July with no note anywhere"]},{header:!1,cells:["The board fixture is built by walking every archive day","so that same vanished yes is still the portal's one card on the board, marked last_seen: 2026-07-20"]},{header:!1,cells:["MAYBE never reaches the board","only yes is kept for non-federal portals. Tonight's best result, score 42, stops at the report file"]},{header:!1,cells:["MDOT proposal packets carry no contact block","contact name, email and phone publish as empty for every bid, forever. Not a scraper bug"]},{header:!1,cells:['federal_project_no on the advertised row is the single letter "s"',"a parse slip on the one row that matters most, and nothing validates the field"]},{header:!1,cells:["new-bids.json holds the whole snapshot, not the new bids","211 rows in a file named for the 10"]},{header:!1,cells:["mdot-bids-view.html is written by a script no phase calls","its header is hardcoded to 2026-06-20 and it reads only the last run's verdicts. It is an onboarding snapshot, not a live board"]},{header:!1,cells:["data/ms-mdot-letting/PORTAL.md is still an auto-generated draft","its pull, detail and field-map sections are all TODO. Everything on this page comes from the code and the files, not from that runbook"]}]],paragraphs:[]},{heading:"Where the written model is now out of date",tables:[[{header:!0,cells:["The model doc says","The files say"]},{header:!1,cells:["206 rows: 1 advertised + 201 watchlist + 4 local agency","211 rows: 1 + 205 + 5 (bids/index.json, 28 July)"]},{header:!1,cells:["10 proposal packets cached on disk","23 files in data/ms-mdot-letting/cache/proposals/"]},{header:!1,cells:["this portal contributes exactly one yes, mdot-109967301","true as history, but that bid is in no verdicts file from 23 July onward and is absent from tonight's snapshot. The live yes count is 0"]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk, with long text shortened by a trailing ellipsis and never reworded. Every count traces to data/ms-mdot-letting/daily/2026-07-28/stats.json, to bids/index.json, or to a row count of the named file. Baseline map: docs/portal-dataflow/ms-mdot-letting.md (evidence-cited to file:line). Fact sheet: docs/portal-dataflow/pedia-inspect/ms-mdot-letting.json."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk, with long text shortened by a trailing ellipsis and never reworded. Every count traces to data/ms-mdot-letting/daily/2026-07-28/stats.json, to bids/index.json, or to a row count of the named file. Baseline map: docs/portal-dataflow/ms-mdot-letting.md (evidence-cited to file:line). Fact sheet: docs/portal-dataflow/pedia-inspect/ms-mdot-letting.json.",c="docs/portal-dataflow/pedia-ms-mdot-letting.html",p={slug:e,title:t,eyebrow:s,headline:n,lede:a,funnel:o,funnel_note:i,legend:r,stages:l,sections:d,footer:h,source_page:c};export{p as default,s as eyebrow,h as footer,o as funnel,i as funnel_note,n as headline,a as lede,r as legend,d as sections,e as slug,c as source_page,l as stages,t as title};
