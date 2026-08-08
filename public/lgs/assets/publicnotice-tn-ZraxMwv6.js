const e="publicnotice-tn",t="Public Notice TN: what happens to a legal notice, stage by stage",a="Portal pedia · 40",s="Public Notice TN: from a newspaper search box to the board",n="This is not a bid portal. It is Tennessee's newspaper legal-notice board, mostly foreclosures and estate sales. We type ten work phrases into its search box with a headless browser and keep whatever comes back. Every stage below carries a real record from the actual file on disk. Two notices are followed the whole way: one that was thrown out at triage, one that reached the board as a YES at score 90. All data is from the run of 28 July 2026.",o=[{value:"111",label:"in snapshot"},{value:"99",label:"carried over"},{value:"12",label:"new tonight"},{value:"15",label:"triage says open"},{value:"96",label:"triage says skip"},{value:"8",label:"yes"},{value:"0",label:"maybe"},{value:"7",label:"no"}],i="Every number above is from data/publicnotice-tn/daily/2026-07-28/stats.json (460 bytes). Read the last four cells carefully. Only 12 notices were new and only 3 of them were sent to the judge that night. The 15 OPEN and the 8/0/7 score split count the merged set: tonight's work plus every decision carried forward from earlier days. Never quote them as one night's output.",r=["Notice A · 542898 · an EPB Chattanooga legal notice whose captured title is a street address. Dies at triage.","Notice B · 552138 · BrightRidge vegetation management, Johnson City. Ends as YES, score 90."],l=[{n:"0",title:"Is it due today?",who:"scripts/portal_due.py --batch portals",summary:["The gate looks at the newest folder name under data/publicnotice-tn/daily/ and compares it to today. This portal's cadence is 1 day, so it is due every day and its slug gets printed for the orchestrator to pick up.","Not printed means not run. Nothing is lost when that happens, because the next run compares against whatever the last archived day was, however old it is."],cells:[{label:"In",paths:[{path:"data/portals/registry.json",size:"cadence_days: 1"},{path:"data/publicnotice-tn/daily/*",size:"36 dated folders, 7 June to 28 July"}],blocks:[],notes:["The folder list is not continuous. Of the 35 steps between those 36 days, 26 are one day and the rest are gaps: six of two days, two of four days and one of five. Cadence says every day; the archive says otherwise. The date used is UTC-pinned, not local."],tables:[]},{label:"The registry row that decides everything downstream",paths:[],blocks:[`{
 "slug": "publicnotice-tn",
 "engine": "publicnotice_lrs",
 "batch": "portals",
 "cadence_days": 1,
 "authed": false,
 "enrich_passes": [],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:["Four of these keys switch whole stages off later: no enrich passes, no watch, and carry_forward: engine-internal, which takes the portal out of the shared carry-forward run at stage 9."],tables:[]}],notes:[],then:"the slug is printed, so a child agent is started"},{n:"1",title:"The orchestrator hands it to a child",who:"Agent → .claude/skills/publicnotice-tn-sweep/SKILL.md",summary:["The portal is slot 5 of Batch F, started in parallel with four other portals. One of them is publicnotice-pa, the Pennsylvania twin running the identical engine. Both open their own headless browser at the same time.","The child agent owns everything from the pull through the archive. If it fails, the roll-up marks this portal FAILED and the rest of the batch keeps going."],cells:[{label:"What the child was told to run, and how long it took that night",paths:[],blocks:[`21:06:50 pull starts (logs/pull_log.txt)
21:07:25 111 notices written, index.json stamped
21:12:08 stats.json generated_at
22:37:29 report.md rewritten by the shared renderer`],notes:["The pull itself is 35 seconds. The whole sweep, from first search to finished archive, is about five minutes. That is why this portal is not on the heavy-pull foreground list."],tables:[]}],notes:[],then:"ten searches, one browser, no login"},{n:"2",title:"Type ten phrases and scrape the results grid",who:"data/publicnotice-tn/scripts/run_daily.py · step 1, ps.pull",summary:["One headless browser opens the search page and runs ten searches. Each row of each results grid becomes a bid: the site's own record number is the id, the search-result snippet is the whole description, and the title and the buyer are guessed out of that snippet with regular expressions. There is nothing else to read.","The ten searches returned 139 rows that night. After removing rows that matched more than one phrase, 111 unique notices were written."],cells:[{label:"In → Out",paths:[{path:"https://www.tnpublicnotice.com/Search.aspx",size:"ASP.NET postback, not a plain URL"},{path:"bids/all-bids.json",size:"85.5 KB · 111 rows · 12 fields"},{path:"bids/index.json",size:"502 bytes · snapshot_total 111, open_total 111"},{path:"logs/pull_log.txt",size:"42.6 KB, appended every run"}],blocks:[`tree removal 5
tree trimming 7
debris removal 7
vegetation management 8
mowing 14
brush 14
stump removal 1
land clearing 50 ← the cap, again
right-of-way clearing 33
storm debris no results`],notes:[],tables:[]},{label:"Real record Notice A",paths:[],blocks:[`{
 "bid_id": "542898",
 "title": "office at 1350 E 8th Street,
 Chattanooga, Tennessee 37403 until 2:00 PM",
 "buyer": "Chattanooga Times Free Press",
 "state": "TN",
 "due_date": "2026-07-31",
 "publication": "Chattanooga Times Free Press",
 "published": null,
 "status": "Open",
 "detail_url": "https://www.tnpublicnotice.com/
 Details.aspx?SID=542898",
 "description": "LEGAL NOTICE Bid Number: 16106
 Bids will be received by EPB at the Purchasing
 office at 1350 E 8th Street, Chattanooga,
 Tennessee 37403 until 2:00 PM, July 31, 2026
 Bid forms and additional information may be
 picked up at 12:00 PM on June 22, 2026 at
 EPB’s Purchasing Department or request …",
 "_detail_ok": true,
 "_keywords": ["tree removal"]
}`],notes:['Look at what happened here. The title is a street address. The only all-capitals phrase in the snippet is "LEGAL NOTICE", which the code throws away as boilerplate, so the title falls through to the next rule: take a window of words around the first work word. The work-word pattern is not word-bounded, so it matched "tree" inside the word "Street", and the window around that is the address. The buyer is the newspaper, not EPB, because no "City of" phrase appeared in the snippet. And _keywords says the site itself matched this notice on "tree removal", but the captured text stops before any scope.'],tables:[]}],notes:['Three walls stand right here, and no later stage can climb them. First, the cap: each phrase returns at most the freshest 50 notices, one page only, and "land clearing" has hit exactly 50 on 40 of the 41 logged pulls. Anything older is invisible. Second, status is written as "Open" for all 111 rows regardless of reality, so we never learn a solicitation closed. Third, there is no readable detail page, so this ~300-character snippet is the entire description forever.'],then:"compare tonight's 111 against the last archived day"},{n:"3",title:"Split into new and already-decided",who:"run_daily.py · step 2, ps.prep",summary:["Every notice is keyed by the site's record number. If that number already has a decision in the most recent archived day, the decision is copied across and the notice never troubles the AI again. The rest go on the new list.","The comparison that night was against 24 July, which held 116 ids. 99 of tonight's 111 matched and were carried. 12 were new. And 17 notices from 24 July had dropped out of the search results entirely."],cells:[{label:"In → Out",paths:[{path:"bids/all-bids.json",size:"111 rows"},{path:"daily/2026-07-24/triage.json",size:"the prior decisions"},{path:"runs/triage-input.json",size:"2.4 KB · 12 rows"},{path:"runs/triage-carryover.json",size:"14.5 KB · 99 rows (87 SKIP, 12 OPEN)"},{path:"runs/judge-input.json",size:"92.6 KB · 111 rows"},{path:"runs/_funnel.json",size:"155 bytes"}],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 111,
 "carryover_count": 99,
 "triage_input_count": 12,
 "prior_archive_ids_compared_against": 116
}`],notes:["99 + 12 = 111. The arithmetic closes, which is the point of this file."],tables:[]},{label:"Real record Notice B · brand new",paths:[],blocks:[`{
 "idx": 18,
 "bid_id": "552138",
 "title": "accepting sealed bids for Vegetation
 Management. MANDATORY PRE-BID MEETING on 8/5",
 "buyer": "Johnson City Press",
 "state": "TN",
 "due_date": null
}`,`{
 "bid_id": "542898",
 "decision": "SKIP",
 "reason": "office address fragment,
 not a bid title"
}`],notes:["Notice A was not new on 28 July. It arrived as one of the 99 carried rows, already stamped SKIP by an earlier night for a reason that is honest about what went wrong: the AI could see the title was an address, not a bid. It will never be looked at again."],tables:[]}],notes:["Two things worth noticing about this stage. The idx on Notice B is 18, but the file only has 12 rows. idx is the position in the full 111-row snapshot, not the row number, so it is not a count of anything. And judge-input.json is built for all 111 notices, new or not. It is the biggest file the run writes, 92.6 KB, and stage 6 reads it back only to keep the 3 rows it needs. The other 108 are assembled every night and never used."],then:"12 titles go to the first AI"},{n:"4",title:"Pass 1: keep or drop, on the title alone",who:"max-triage · AI, dispatched by the child agent",summary:["Twelve titles, six fields each, no description. The default answer is SKIP. A notice is opened only when the title names LGS work in plain words or reads like a cryptic municipal invitation to bid. Tennessee is one of LGS's core states, so nothing here gets an out-of-core flag.","Result: 9 SKIP, 3 OPEN. And two of the three OPENs are the same notice."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"12 rows"},{path:"runs/triage-verdicts.json",size:"3.5 KB · 12 rows"}],blocks:[`552138 Sealed bids for Vegetation Management,
 core LGS work
551955 Sealed bids for Vegetation Management,
 core LGS work
551988 Cryptic municipal ITB, Memphis
 purchasing, scope hidden`],notes:["552138 and 551955 are the identical BrightRidge notice published under two record numbers. Nothing in the pipeline collapses them here."],tables:[]},{label:"Real record Notice B · opened",paths:[],blocks:[`{
 "bid_id": "552138",
 "idx": 18,
 "decision": "OPEN",
 "reason": "Sealed bids for Vegetation
 Management, core LGS work",
 "title": "accepting sealed bids for Vegetation
 Management. MANDATORY PRE-BID MEETING on 8/5",
 "buyer": "Johnson City Press",
 "state": "TN",
 "due_date": null
}`],notes:["Eight keys. The AI wrote the whole input row back out with two fields added. No code checks the shape of this file. The Pennsylvania twin ran the same skill on the same engine and wrote its own copy of this file a minute and a half later that same night (21:09:43 here, 21:11:09 there), and every one of its 12 rows has five keys, not eight. Same template, two different files, nothing to notice the difference."],tables:[]}],notes:['This is where Notice A was lost, on an earlier night. The search engine on the site matched that notice on the phrase "tree removal", which is the strongest hint we have that it is real LGS work. But the only thing Pass 1 ever sees is the derived title, and the derived title was a street address. The AI made the right call on the evidence it was handed. The evidence was the problem, not the call.'],then:"the OPENs would normally be enriched here"},{n:"5",title:"Enrich the OPENs: a hard no-op",who:"ps.enrich_opens → publicnotice_lrs.enrich_details",summary:["On most portals this stage opens each promising bid's detail page and fetches the real document. Here the function returns zero without touching the network, and there is no version of this portal where it could do more.","The reason is the site's own design. Details.aspx?SID=… only renders the notice body as part of a live form session. Ask for that address cold and you get an empty page. It is a link for a human to click, not a page we can fetch."],cells:[{label:"In",paths:[{path:"runs/triage-verdicts.json",size:"the 3 OPEN ids"},{path:"nothing",size:"returns 0, writes no file"}],blocks:[],notes:[],tables:[]},{label:"What that costs, measured on this run",paths:[],blocks:[`notices in snapshot 111
with a document 0
with a named contact 0
with a real due date 67
with due_date null 44
status field, distinct values 1 ("Open")`],notes:['Contact 0% and documents 0% are permanent on this portal, and the sentinel reports them every night as "thin capture". That is a known wall, not a broken script.'],tables:[]}],notes:[],then:"build the list of notices that still need a score"},{n:"6",title:"Who still needs a verdict?",who:"ps.build_judge_input_open",summary:["Tonight's three new OPENs, plus any OPEN carried from an earlier day that somehow never got scored. Anything already scored is left alone, which is why the judge sees three rows and not fifteen.","Each row gets a labelled block of text built for the AI: title, buyer, state, closing date, source link, then the snippet. For this portal the snippet is the whole thing."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json",size:"3 OPEN"},{path:"runs/triage-carryover.json",size:"12 OPEN carried"},{path:"daily/2026-07-24/verdicts.json",size:"who already has a score"},{path:"runs/judge-input-open.json",size:"2.5 KB · 3 rows"}],blocks:[],notes:['15 notices are OPEN tonight. 12 of them already carry a verdict from an earlier night, so only 3 reach the judge. That gap between "15 open" and "3 judged" is the single most misread pair of numbers on this portal.'],tables:[]},{label:"Real record Notice B, as the judge receives it",paths:[],blocks:[`{
 "idx": 18,
 "bid_id": "552138",
 "title": "accepting sealed bids for Vegetation
 Management. MANDATORY PRE-BID MEETING on 8/5",
 "buyer": "Johnson City Press",
 "state": "TN",
 "due_date": null,
 "detail_url": "https://www.tnpublicnotice.com/
 Details.aspx?SID=552138",
 "description_full": "Title: accepting sealed bids
 for Vegetation Management. MANDATORY PRE-BID
 MEETING on 8/5
 Buyer: Johnson City Press
 State: TN
 Closes: None
 Source URL: https://www.tnpublicnotice.com/
 Details.aspx?SID=552138

 RFP body:
 BrightRidge is now accepting sealed bids for
 Vegetation Management. MANDATORY PRE-BID
 MEETING on 8/5/2026 @10:30am EST. Bids are due
 at 2:00 pm (EST) 08/12/2026. Send a clearly
 identified email with an attached PDF of the
 digital bid and all required documents to:
 SEALEDBIDS@BRIGHTRIDGE.COM Sp …"
}`],notes:["The header says Closes: None and the body says bids are due 12 August. The real buyer, BrightRidge, is in the body while the buyer field says the newspaper. Everything the judge needs to fix both is sitting in that one paragraph."],tables:[]}],notes:[],then:"three notices get scored"},{n:"7",title:"Pass 2: yes, maybe or no, out of 100",who:"max-bid-judge · AI, dispatched by the child agent",summary:["Three notices scored that night: two YES at 90 and one NO at 25. The two YES rows are the same BrightRidge solicitation under two record numbers, and the judge scored the second one on its own merits rather than calling it a duplicate.","The NO is worth reading. The Memphis notice was opened at Pass 1 as a cryptic municipal invitation, and the judge refused to guess: the captured text ends before the item list, so there is no work to score."],cells:[{label:"In → Out",paths:[{path:"runs/judge-input-open.json",size:"3 rows"},{path:"runs/judge-verdicts.json",size:"2.5 KB · 3 rows"}],blocks:[`{
 "bid_id": "551988",
 "title": "Legal Notice To Bidders",
 "buyer": "City of Memphis Purchasing Agent",
 "would_lgs_bid": "no",
 "score": 25,
 "primary_reason": "This is the City of Memphis
 Purchasing Agent's standard omnibus bid-ad
 header, not a solicitation for any particular
 work. The captured text ends before the item
 list, so there is no scope, no commodity, and
 no work shape to score against …",
 "red_flags": [
 "omnibus_notice_no_scope_in_snippet"
 ],
 "close_date_body": null,
 "close_date_quote": null
}`],notes:[],tables:[]},{label:"Real record Notice B · YES, 90",paths:[],blocks:[`{
 "bid_id": "552138",
 "title": "accepting sealed bids for Vegetation
 Management. MANDATORY PRE-BID MEETING on 8/5",
 "buyer": "Johnson City Press",
 "state": "TN",
 "due_date": null,
 "would_lgs_bid": "yes",
 "score": 90,
 "primary_reason": "BrightRidge (the Johnson City
 Power Board, a TN municipal electric utility)
 is taking sealed bids for Vegetation
 Management - Category 2 core work with a buyer
 archetype already in the win column (Knoxville
 Utilities Board circuit tree pruning, same
 state, same utility type). This is a real
 solicitation inviting bids, not a utility
 announcing its own ROW work …",
 "red_flags": [
 "mandatory_pre_bid_meeting_2026_08_05"
 ],
 "close_date_body": "2026-08-12",
 "close_date_quote": "Bids are due at 2:00 pm
 (EST) 08/12/2026."
}`],notes:[],tables:[]}],notes:[`The judge solved a problem and the answer was dropped on the floor. It read the closing date out of the notice body and wrote it down twice, once as a date and once as the sentence it came from. Search the whole repository for close_date_body and there is no reader: not in scripts/, not in the shared engine library. So due_date stays null, tonight's report prints "closes unknown" for this bid, and the card that reaches the board carries an empty due date. The correct date, with a verbatim quote to back it, is sitting in runs/judge-verdicts.json being used by nothing.`],then:"merge tonight's answers with everything carried, and write the day"},{n:"8",title:"Write the archive, and carry the old verdicts forward",who:"ps.compile_archive",summary:["Three files become the permanent record of the night. Carried Pass 1 rows and new ones are merged into a single 111-row decision list, which is what tomorrow's run will compare against. Yesterday's verdicts for notices that are still in the search results are merged with tonight's three.","That merge is why verdicts.json holds 15 rows on a night when the judge produced 3. It is also this portal's entire memory: without it, a quiet night would blank every verdict it ever earned."],cells:[{label:"Out · data/publicnotice-tn/daily/2026-07-28/",paths:[],blocks:[],notes:[`new-bids.json is badly named. It is a byte-for-byte copy of the snapshot: 111 rows, 87,508 bytes, the same as bids/all-bids.json. Nothing in that file marks which 12 were new. Anyone reading it as "tonight's new bids" is off by a factor of nine.`],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","111 rows: the whole snapshot, not the 12 new","85.5 KB"]},{header:!1,cells:["triage.json","111 decisions, 96 SKIP / 15 OPEN. Tomorrow's memory","18.0 KB"]},{header:!1,cells:["verdicts.json","15 merged rows: 8 yes, 0 maybe, 7 no","13.8 KB"]},{header:!1,cells:["stats.json","the funnel counts on this page","460 B"]},{header:!1,cells:["report.md","human summary, rewritten later at stage 10","4.0 KB"]}]]},{label:"Real record Notice B in verdicts.json",paths:[],blocks:[`{
 "bid_id": "552138",
 "title": "accepting sealed bids for Vegetation
 Management. MANDATORY PRE-BID MEETING on 8/5",
 "buyer": "Johnson City Press",
 "state": "TN",
 "due_date": null,
 "would_lgs_bid": "yes",
 "score": 90,
 "primary_reason": "BrightRidge (the Johnson City
 Power Board, a TN municipal electric utility)
 is taking sealed bids for Vegetation
 Management …",
 "red_flags": [
 "mandatory_pre_bid_meeting_2026_08_05"
 ],
 "close_date_body": "2026-08-12",
 "close_date_quote": "Bids are due at 2:00 pm
 (EST) 08/12/2026.",
 "bid_key": "publicnotice-tn:552138",
 "verdict": "yes"
}`,`{
 "bid_id": "542898",
 "decision": "SKIP",
 "reason": "office address fragment,
 not a bid title"
}`],notes:["Two keys are added here: bid_key, which is how the shared board will find it, and verdict, a copy of would_lgs_bid that exists because two different judge output schemas have to be healed at this boundary.","Notice A's journey ends here, as it has on every archived day since 21 June: pulled, matched, decision copied. That same three-key row now sits in 24 of the 36 archived days, always SKIP. It costs nothing and it will never be reconsidered."],tables:[]}],notes:["Every carried row keeps the shape it was born with. Because each night's decisions are copied forward untouched, today's triage.json contains 63 rows with 3 keys, 18 rows with 4 and 30 with 8. The 15-row verdicts.json is worse: 10 different shapes in 15 rows, from 8 keys to 16. Three rows still carry lgs_score, a key the current instructions ban; the compiler quietly copies it into score so nothing downstream notices. Nothing validates either file.","And three rows in tonight's archive carry a flag that is simply wrong. 543244 out_of_core_state: true yes, 85 Memphis Light Gas & Water ROW 547513 out_of_core_state: true yes, 82 Shelbyville line clearance 547525 out_of_core_state: true no, 15 Grundy County Schools Tennessee is one of LGS's eight core states, so no bid here should ever carry that flag. The instruction that caused it was corrected on 13 July 2026, but a corrected instruction does not reach back: these verdicts were written before the fix and have been carried forward untouched every night since. Two of the three are live YES bids on the board. The carry-forward that protects this portal's memory also preserves its mistakes, and no stage in the run ever re-checks a carried verdict."],then:"a hazard that sits next to this stage, but does not run tonight"},{n:"!",title:"The QA gate that can erase a night's Pass 1",who:"scripts/portal_qa.py · NOT part of the nightly run",summary:["This never runs inside the normal sweep. It only fires when an operator invokes the quality gate by hand. When it does, and the pull finds any new notices, it fakes a Pass 1 where every new notice is SKIP, blanks Pass 2, and compiles that into today's archive to prove the run is repeatable.","Those fake SKIPs then become tomorrow's carried decisions, and because this portal carries its own memory forward inside the sweep, they stay SKIP forever. The affected notices never re-enter triage and never reach the judge."],cells:[{label:"Status on disk today",paths:[],blocks:[`grep "qa-baseline" across all 36 archived days → no matches
damage to any archived day → none`],notes:[`Two comments in the repository name this wrong. Both call it the "--stage full clobber". The block is actually gated on the pull's exit code, not on the stage, so the default run clobbers exactly the same way. Anyone who trusts those comments and runs the default stage on a live day will be surprised.`],tables:[]}],notes:[],then:"the portal's own night is over, and the shared machinery takes it from here"},{n:"9",title:"The shared carry-forward skips this portal on purpose",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:['The registry says carry_forward: "engine-internal". The shared script only picks up portals marked "orchestrator", of which there are 8. This portal is one of 38 marked engine-internal, so the --all run walks straight past it and writes nothing.',"That is deliberate and correct. The work already happened twice inside the sweep: Pass 1 decisions were carried at stage 3, Pass 2 verdicts were merged at stage 8. Running the shared pass as well would apply the same rescue a second time."],cells:[{label:"The audit files that are actually on disk",paths:[],blocks:[`{
 "portal": "publicnotice-tn",
 "today": "2026-06-23",
 "prior_date_used": "2026-06-22",
 "today_new_judged": 13,
 "carried_forward": 2,
 "carried_forward_not_in_today_snapshot": 2,
 "dropped_too_old": 0,
 "dropped_already_judged_today": 13,
 "dropped_closed_award": 0,
 "final_total": 15,
 "final_yes": 10,
 "final_maybe": 1,
 "final_no": 4,
 "max_age_days": 90
}`],notes:['But it has run on this portal three times, and the model doc says it never has. docs/portal-dataflow/publicnotice-tn.md states plainly: "no _carryforward_audit.json is ever written for this portal" and "Confirmed on disk". Three of those files exist. Nothing on disk records how they came to be written, so whether an operator forced it with --portal or the registry flag was different on those days is not knowable from the archive.',`Read the 23 June row carefully. All 13 of that day's own verdicts were dropped as "already judged today", so no verdict was applied twice. What the shared pass did was put back two verdicts for notices that were no longer in that day's search results. The sweep's own merge had filtered exactly those out on purpose, because it only keeps verdicts for notices still in the snapshot. The two passes disagree about what should happen to a notice that has dropped off the site, and on that one day the shared pass won.`],tables:[[{header:!0,cells:["Day","Judged that day","Carried forward","Of those, not in that day's snapshot"]},{header:!1,cells:["2026-06-09","12","0","0"]},{header:!1,cells:["2026-06-23","13","2","2"]},{header:!1,cells:["2026-07-15","15","0","0"]}]]}],notes:[],then:"the ledger, the report and the board fixtures"},{n:"10",title:"Ledger, report, board cards",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared scripts in a row. The first walks every one of this portal's 36 archived days and folds its YES and MAYBE rows into the all-portal ledger with first-seen and last-seen dates. The second rewrites today's report so every portal's looks the same. The third turns YES verdicts into cards for the review board.","The ledger is where a notice that fell out of the search results survives. Today's archive only keeps verdicts for notices still in the top 50 per phrase; the ledger keeps every day ever written."],cells:[{label:"Out",paths:[{path:"data/portals/cumulative-yes.json",size:"17 live + 1 archived from this portal"},{path:"daily/2026-07-28/report.md",size:"4.0 KB, rewritten 22:37 UTC"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"1,470 cards total · 15 from this portal"}],blocks:[],notes:["MAYBE dies here. The dump keeps YES only. 15 of this portal's 36 archived days carried a MAYBE, one or two at a time, and none of them ever reached the board. The last was 23 June. This run scored 0 MAYBE, so nothing was lost that night."],tables:[]},{label:"How the report renders Notice B",paths:[],blocks:[`## YES — Max would bid

- **[90] accepting sealed bids for Vegetation
 Management. MANDATORY PRE-BID MEETING on 8/5**
 — Johnson City Press · closes unknown
 BrightRidge (the Johnson City Power Board, a TN
 municipal electric utility) is taking sealed
 bids for Vegetation Management …
 _flags: mandatory_pre_bid_meeting_2026_08_05_
 link: https://www.tnpublicnotice.com/
 Details.aspx?SID=552138`],notes:['"closes unknown", on a bid whose closing date the judge extracted and quoted four steps earlier. And the buyer line names the newspaper. Both are honest reflections of the fields the renderer is allowed to read.'],tables:[]}],notes:[],then:"notices stop being folder-shaped and become rows on the shared board"},{n:"11",title:"Publish, cluster, dedup",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["The 15 YES cards are pushed into the shared bids table, given a portal row and a sweep-run row, then clustered against every other portal's bids so one solicitation seen in three places becomes one thing for the operator to look at.","This portal is flagged as an aggregator. When one of its notices lands in the same cluster as a bid from a real procurement portal, the other portal's buyer name wins the display. That is the only thing standing between the operator and a newspaper name shown as the buying agency."],cells:[{label:"In → Out",paths:[{path:"PortalPro/src/fixtures/portal-bids.json",size:"15 cards"},{path:"Supabase bids",size:"one row per record number"},{path:"Supabase clusters + bids.cluster_id",size:null},{path:"Supabase sweep_runs",size:"counts read from stats.json"}],blocks:[],notes:["The clustering runs on a buyer name that is wrong 74% of the time. 82 of the 111 rows pulled that night have buyer exactly equal to publication, meaning the regex found no agency and fell back to the paper. Buyer is what the clusterer blocks and splits on. On a cluster where this portal is the only member, there is nothing to demote to, and the newspaper name is what the operator sees."],tables:[]},{label:"Real card Notice B on the board",paths:[],blocks:[`{
 "id": "ae6ef8367f28a77e",
 "portal": "publicnotice-tn",
 "source_bid_id": "552138",
 "title": "accepting sealed bids for Vegetation
 Management. MANDATORY PRE-BID MEETING on 8/5",
 "buyer": "Johnson City Press",
 "state": "TN",
 "solicitation_no": null,
 "federal": false,
 "score": 90,
 "verdict": "yes",
 "category": "",
 "due_date": "",
 "contact_name": null,
 "contact_email": null,
 "contact_phone": null,
 "red_flags": [
 "mandatory_pre_bid_meeting_2026_08_05"
 ],
 "fit_signals": [],
 "first_seen": "2026-07-28",
 "last_seen": "2026-07-28",
 "has_documents": false
}`],notes:["Buyer is the newspaper. Due date is empty. No contact, no documents, no solicitation number. The score and the reasoning are the only things on this card that carry real weight, and they came entirely from a 300-character snippet."],tables:[]}],notes:[],then:"the board tries to fill what the portal could not"},{n:"12",title:"Documents and requirements: nothing of its own",who:"2.85b run_enrichment_phase.py · 2.87 requirements · 2.89 build_bidpack.py",summary:["The shared document publisher looks at every portal's snapshot for a documents list. These rows have no such field, so the portal is skipped before any network call. The registry lists no enrichment passes for it either.",'Requirements extraction reads document text per cluster. A cluster whose only member is one of these notices gets a neutral "no material" row rather than a permanent "not extracted yet" badge. The bid pack still gets built, with a page holding the snippet and an empty documents folder.'],cells:[{label:"The reason written down instead of a blank",paths:[],blocks:[],notes:["Where this portal actually earns its place. The same municipal invitation often appears here and on a real procurement portal. When the two collapse into one cluster, the notice inherits that portal's bid packet and its extracted requirements. A newspaper legal notice with no documents of its own can still tell you a bid exists that you would otherwise have missed."],tables:[[{header:!0,cells:["Missing field","Gap reason on record"]},{header:!1,cells:["documents",`gated_login: "Public-notice listing; solicitation files sit behind the paper's reader login"`]},{header:!1,cells:["buyer contact","named, if at all, inside the login-gated solicitation packet"]},{header:!1,cells:["notice body","the detail page will not render on a cold request; the grid snippet is all there is"]}]]}],notes:[],then:"now that documents exist elsewhere, look at the pairs again"},{n:"13",title:"Second look at the duplicate pairs",who:"2.875 · dedup re-pass",summary:["After enrichment, any pair of bids whose evidence changed is judged again. Nothing enriches this portal, so its own rows never change and it never triggers the re-pass by itself. What can change is the other side: a direct portal fills in a buyer or a closing date, and suddenly one of its bids is comparable to a notice sitting here.","This is also the stage that should be catching this portal's own twins, and on this run it had plenty to work with."],cells:[{label:"Two board cards, one solicitation. Checked by reading both bodies.",paths:[],blocks:[`552138 / 551955 BrightRidge vegetation management
 bodies identical, word for word
 both YES, both 90, two cards

535906 / 535441 Graysville brush pickup
 bodies identical, both 65
 one card title ends "(dup)"
 and is on the board anyway`,`534157 Elizabethton Electric tree trimming
 body: "… until 11:00 A.M., Tuesday, June 9"
530687 Elizabethton Electric tree trimming
 body: "… until 11:00 A.M., Tuesday, May 12"
 card title ends "(prior cycle)"`],notes:['15 cards is not 15 solicitations, and telling the two apart needs the body text. A legal notice runs in a paper for weeks and gets a fresh record number each time, so the same bid arrives again with a new id. But the same buyer also re-bids the same work each cycle, and that is two real bids. Only the closing date inside the snippet separates them, and the closing date is exactly the field this portal keeps losing. Cross-portal dedup is the only thing that can collapse the true duplicates, and it has to do it on a buyer name that says "Johnson City Press".',"Do not count duplicates by title. The 111 rows carry only 48 distinct titles and 13 titles repeat, but that number mixes two different things. Tonight's new list alone holds two rows titled Notice Of Substitute Trustee, from two different newspapers, that have nothing to do with each other. The derived title collapsed both to the same boilerplate phrase. A repeated title here means the title regex gave up, not that the bid is repeated."],tables:[]}],notes:[],then:"notice changes, send the mail, check the run"},{n:"14",title:"Watch, digests, sentinel",who:"2.88 · watch_list_signals.py · new_bids_email.py · pipeline_sentinel.py",summary:["New YES clusters appear in the discovery email. The sentinel then checks whether this portal swept on time and whether its capture is thin, and writes one row for it into the shared health file.","The watcher can find almost nothing here. Status is hardcoded at pull time, the grid has no addendum counter, and there is no detail page to re-read. The only live signal is a closing date changing when the snippet is parsed again."],cells:[{label:"This portal's sentinel row, as written 30 July 2026",paths:[],blocks:[`{
 "slug": "publicnotice-tn",
 "batch": "portals",
 "status": "AMBER",
 "issues": [
 "thin capture: contact 0% docs 0%
 -> /portal-perfect publicnotice-tn"
 ],
 "last_archive": "2026-07-28",
 "surfaced": 15
}`],notes:["The one open issue cannot be fixed. Contact 0% and documents 0% are what this source is. The stale-sweep warning that the written model quotes is gone, because the portal did run on 28 July. Two other things are dead on this path by configuration, not by fault: watch mode is none, and the emails are a silent no-op until an API key is placed in data/auth/resend.env."],tables:[]}],notes:[],then:null}],h=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","What it does to you"]},{header:!1,cells:["The title is guessed, not read. Four regex fallbacks, and the work-word pattern the second one leans on has no word boundary",`Notice A's title is "office at 1350 E 8th Street, Chattanooga…" — the pattern found "tree" inside "Street" and took the words around it. The site matched that notice on the phrase "tree removal", and Pass 1 killed it on the title. A real bid can be lost with a correct-looking SKIP reason`]},{header:!1,cells:["The buyer falls back to the newspaper. 82 of 111 rows on 28 July have buyer equal to publication",'Clustering blocks and splits on buyer. On a cluster with no other portal in it, "The Daily News" is shown to the operator as the buying agency']},{header:!1,cells:['The judge finds the closing date and nobody reads it. close_date_body: "2026-08-12" plus a verbatim quote',`No reader exists for that key anywhere in the repo. The report prints "closes unknown" and the board card's due date is an empty string. 44 of 111 rows have no due date at all`]},{header:!1,cells:["50 notices per phrase, one page, sorted newest first",'"land clearing" returned exactly 50 again on 28 July, as on 40 of the 41 logged pulls (the one exception, 16 June, returned 10). Everything older than the freshest 50 for that phrase has never been seen and never will be']},{header:!1,cells:['"storm debris" has returned nothing on every run since 21 July',"Ten phrases go out, nine come back. The four most recent logged pulls — 21, 23, 24 and 28 July — all got no results; the 37 pulls before them got between 1 and 24 notices. Something changed on that one phrase in late July and nothing in the pipeline noticed"]},{header:!1,cells:["The same solicitation arrives with new record numbers","111 rows, 48 distinct titles. Both BrightRidge copies were judged separately and both are on the board. Card counts overstate how many real bids there are"]},{header:!1,cells:["There is no detail page. Details.aspx?SID= will not render cold, so enrichment is a hard zero","Contact 0% and documents 0%, permanently. Every score on this portal comes from about 300 characters"]},{header:!1,cells:['status is written as "Open" for every row',"All 111 rows say Open. We never learn a solicitation closed. The only time signal is a due date, when the regex finds one"]},{header:!1,cells:["new-bids.json holds the whole snapshot",'111 rows, byte-identical to bids/all-bids.json. It has never held "new bids". Nothing in it marks which 12 were new']},{header:!1,cells:["Three wrong out_of_core_state flags are still in the live archive","Bids 543244, 547513 and 547525 carry out_of_core_state: true on Tennessee work. TN is a core state. The instruction was fixed on 13 July; the already-written verdicts carry forward untouched, and two of the three are YES bids on the board today"]},{header:!1,cells:["Carried rows keep whatever shape they were born with","triage.json: 63 rows with 3 keys, 18 with 4, 30 with 8. verdicts.json: 10 different shapes in 15 rows, 8 keys to 16, three still carrying the banned lgs_score. No validator looks at either"]},{header:!1,cells:["_keywords is written on every row and read by nothing","The engine records which phrase matched. Grep finds readers only in the BidNet, DemandStar and MyVendorLink scripts. It is the one field that could have told triage why Notice A was pulled"]},{header:!1,cells:["The shared carry-forward skips this portal, but has been run on it by hand","The model doc says no audit file was ever written here. Three exist. On 23 June a hand run put back 2 verdicts for notices already dropped from that day's snapshot"]},{header:!1,cells:["The QA gate can overwrite a real day's Pass 1","Gated on the pull's exit code, not on the stage flag, so the default run does it too. The fake SKIPs would carry forward forever. No archived day carries the marker today"]},{header:!1,cells:["TN is missing from the monitor's state map",'The tracking board renders this portal with a blank state and "core: false". Tennessee is a core state. The overview page gets it right because it reads config.json']},{header:!1,cells:["The runbook is still an auto-generated draft",'Every row of the field map in data/publicnotice-tn/PORTAL.md says TODO, and /portal-audit publicnotice-tn has never been run. Its health block is dated 14 July and still reports "last swept 2026-07-13"']},{header:!1,cells:["MAYBE never reaches the board","The fixture dump keeps YES only. 15 of the 36 archived days carried a MAYBE and none of them ever surfaced. The last was 23 June. This run scored 0 MAYBE, so nothing was lost that night"]},{header:!1,cells:["The same skill writes different files on the two twin portals","On 28 July this portal's triage-verdicts.json rows have 8 keys; the Pennsylvania twin's, written a minute and a half later by the same skill on the same engine, have 5. Nothing validates either"]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to daily/2026-07-28/stats.json, a row count, a byte size or a line of logs/pull_log.txt. Both tracer notices exist and were followed end to end. Baseline map: docs/portal-dataflow/publicnotice-tn.md, evidence-cited to file and line, and written against the earlier run of 24 July 2026. Where it disagrees with the files, this page follows the files."]}],d="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to daily/2026-07-28/stats.json, a row count, a byte size or a line of logs/pull_log.txt. Both tracer notices exist and were followed end to end. Baseline map: docs/portal-dataflow/publicnotice-tn.md, evidence-cited to file and line, and written against the earlier run of 24 July 2026. Where it disagrees with the files, this page follows the files.",c="docs/portal-dataflow/pedia-publicnotice-tn.html",p={slug:e,title:t,eyebrow:a,headline:s,lede:n,funnel:o,funnel_note:i,legend:r,stages:l,sections:h,footer:d,source_page:c};export{p as default,a as eyebrow,d as footer,o as funnel,i as funnel_note,s as headline,n as lede,r as legend,h as sections,e as slug,c as source_page,l as stages,t as title};
