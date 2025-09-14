
(function () {
  // ASCII 구두점, General Punctuation(U+2000–206F),
  // CJK 기호/구두점(U+3000–303F), 일부 전각/호환 기호(FF00대) 포함
  const RE_PUNCT = /([!-\/:-@[\]\\^_`{|}~]|[\u2000-\u206F]|[\u3000-\u303F]|[\uFF01-\uFF65\uFFE0-\uFFEE])/g;
  const SKIP_TAGS = new Set(["SCRIPT","STYLE","CODE","PRE","TEXTAREA","NOSCRIPT"]);

  function shouldSkip(node) {
    for (let el = node.parentElement; el; el = el.parentElement) {
      if (SKIP_TAGS.has(el.tagName)) return true;
      // 이미 처리된/의도적으로 제외한 블록은 건너뛰기
      if (el.classList && (el.classList.contains("sym") || el.classList.contains("symbols") || el.classList.contains("no-sym"))) {
        return true;
      }
      if (el.isContentEditable) return true;
    }
    return false;
  }

  function wrapPunctuation(root) {
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(txt) {
        if (!txt.nodeValue || !RE_PUNCT.test(txt.nodeValue)) return NodeFilter.FILTER_REJECT;
        if (shouldSkip(txt)) return NodeFilter.FILTER_REJECT;
        RE_PUNCT.lastIndex = 0; // re-use 대비
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    while (tw.nextNode()) nodes.push(tw.currentNode);

    for (const text of nodes) {
      const parts = text.nodeValue.split(RE_PUNCT); // 캡처그룹 유지 split
      const frag = document.createDocumentFragment();

      for (let i = 0; i < parts.length; i++) {
        const chunk = parts[i];
        if (!chunk) continue;

        if (RE_PUNCT.test(chunk) && chunk.length === 1) {
          const span = document.createElement("span");
          span.className = "symbols";
          span.textContent = chunk;
          frag.appendChild(span);
        } else {
          frag.appendChild(document.createTextNode(chunk));
        }
        RE_PUNCT.lastIndex = 0;
      }
      text.parentNode.replaceChild(frag, text);
    }
  }

  function runOnce() {
    const root = document.getElementById("flipbook");
    if (root) wrapPunctuation(root);
  }

  // 최초 실행
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runOnce);
  } else {
    runOnce();
  }

  // turn.js로 페이지가 동적으로 갱신될 가능성까지 고려 (필요 없으면 주석 처리)
  const root = document.getElementById("flipbook");
  if (root) {
    const mo = new MutationObserver(muts => {
      for (const m of muts) {
        m.addedNodes && m.addedNodes.forEach(n => {
          if (n.nodeType === 1) wrapPunctuation(n); // 새로 들어온 노드만 처리
        });
      }
    });
    mo.observe(root, { childList: true, subtree: true });
  }
})();


	(function(){
  // 네가 보낸 긴 목록 그대로 붙여넣어도 됨.
  // (한글 완성형 블록(U+AC00–U+D7A3)만 추려서 Set에 넣기 때문에,
  //  뒤쪽 설명 문장 등은 자동 무시됨)
  const RAW = `거걱건걷걸걺검겁것겄겅겆겉겊겋겨격겪견겯결겸겹겻겼경곁괴괵괸괼굄굅굇굉궈궉권궐궜궝귀귁귄귈귐귑귓긔기긱긴긷길긺김깁깃깅깆깊꺼꺽꺾껀껄껌껍껏껐껑껴껸껼꼇꼈꼍꾀꾄꾈꾐꾑꾕꿔꿜꿨꿩뀌뀐뀔뀜뀝끼끽낀낄낌낍낏낑너넉넋넌널넒넓넘넙넛넜넝넣녀녁년녈념녑녔녕녘뇌뇐뇔뇜뇝뇟눠눴뉘뉜뉠뉨뉩늬늰늴니닉닌닐닒님닙닛닝닢더덕덖던덛덜덞덟덤덥덧덩덫덮뎌뎐뎔뎠뎡되된될됨됩됫둬뒀뒤뒨뒬뒵뒷뒹듸디딕딘딛딜딤딥딧딨딩딪떠떡떤떨떪떫떰떱떳떴떵떻뗘뗬뙤뙨뛰뛴뛸뜀뜁뜅띄띈띌띔띕띠띤띨띰띱띳띵러럭런럴럼럽럿렀렁렇려력련렬렴렵렷렸령뢰뢴뢸룀룁룃룅뤄뤘뤼뤽륀륄륌륏륑리릭린릴림립릿링머먹먼멀멂멈멉멋멍멎멓며멱면멸몃몄명몇뫼묀묄묍묏묑뭐뭔뭘뭡뭣뮈뮌뮐미믹민믿밀밂밈밉밋밌밍및밑버벅번벋벌벎범법벗벙벚벼벽변별볍볏볐병볕뵈뵉뵌뵐뵘뵙붜붤붰뷔뷕뷘뷜뷩비빅빈빌빎빔빕빗빙빚빛뻐뻑뻔뻗뻘뻠뻣뻤뻥뼈뼉뼘뼙뼛뼜뼝뾔삐삑삔삘삠삡삣삥서석섞섟선섣설섦섧섬섭섯섰성섶셔셕션셜셤셥셧셨셩쇠쇤쇨쇰쇱쇳숴쉈쉬쉭쉰쉴쉼쉽쉿슁시식신싣실싫심십싯싱싶써썩썬썰썲썸썹썼썽쐬쐰쐴쐼쐽쒀쒔쒸쒼씌씐씔씜씨씩씬씰씸씹씻씽어억언얹얻얼얽얾엄업없엇었엉엊엌엎여역엮연열엶엷염엽엾엿였영옅옆옇외왹왼욀욈욉욋욍워웍원월웜웝웠웡위윅윈윌윔윕윗윙의읜읠읨읫이익인일읽읾잃임입잇있잉잊잎저적전절젊점접젓정젖져젼졀졈졉졌졍죄죈죌죔죕죗죙줘줬쥐쥑쥔쥘쥠쥡쥣지직진짇질짊짐집짓징짖짙짚쩌쩍쩐쩔쩜쩝쩟쩠쩡쪄쪘쬐쬔쬘쬠쬡쭤쭸쭹쮜찌찍찐찔찜찝찡찢찧처척천철첨첩첫첬청쳐쳔쳤최쵠쵤쵬쵭쵯쵱춰췄취췬췰췸췹췻췽치칙친칟칠칡침칩칫칭커컥컨컫컬컴컵컷컸컹켜켠켤켬켭켯켰켱쾨쾰쿼퀀퀄퀑퀴퀵퀸퀼큄큅큇큉키킥킨킬킴킵킷킹터턱턴털턺텀텁텃텄텅텨텬텼퇴퇸툇툉퉈퉜튀튁튄튈튐튑튕틔틘틜틤틥티틱틴틸팀팁팃팅퍼퍽펀펄펌펍펏펐펑펴편펼폄폅폈평푀푄풔풩퓌퓐퓔퓜퓟피픽핀필핌핍핏핑허헉헌헐헒험헙헛헝혀혁현혈혐협혓혔형회획횐횔횝횟횡훠훤훨훰훵휘휙휜휠휨휩휫휭희흰흴흼흽힁히힉힌힐힘힙힛힝겂겷겿귕긘긩깄껓껕꼉꿘끠끤낐넏넑넢녇뇍뇡늼늿닁닏닞닠됬됭뒸듼딀딫딮뚸뜄띡럲럳렫뤈릐릔맀맆멷묌뭤뭥뮊뮙뮛믜믠믭믱벘벝벟볌볓뵜붝붠붭붴뷥븨븩븰븽빋빘뻙뼌쀠쇴쇵싀싁싥싰싳쎂쎠쎤쎵쒐씫씼씿얺엏욌웟윘읩읬읭읻잌잍젂젇젉젋젔젹졂졋죅즤짔짗쬧찓찟찦쳡쳥츼칢칬칮칰컽쿽퀌킈킸턻텰텻퇻펖펵픠픵핐헗헠헡헣힜힣`;

  // 한글 완성형(AC00–D7A3)만 추려 Set 생성 (중복 자동 제거)
  const TARGETS = new Set(Array.from(RAW).filter(ch => {
    const cp = ch.codePointAt(0);
    return cp >= 0xAC00 && cp <= 0xD7A3;
  }));

  const SKIP_TAGS = new Set(["SCRIPT","STYLE","CODE","PRE","TEXTAREA","NOSCRIPT"]);

  function shouldSkip(node){
    for (let el = node.parentElement; el; el = el.parentElement){
      if (SKIP_TAGS.has(el.tagName)) return true;
      if (el.classList && (el.classList.contains("han-target1") || el.classList.contains("no-han-target"))) return true;
      if (el.isContentEditable) return true;
    }
    return false;
  }

  // 텍스트 노드의 "문자 단위"로 훑어서, 타깃이면 <span class="han-target">로 감싸기
  function wrapSelectedHangul(root){
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(txt){
        if (!txt.nodeValue) return NodeFilter.FILTER_REJECT;
        if (shouldSkip(txt)) return NodeFilter.FILTER_REJECT;
        // 빠르게 선별: 이 텍스트에 목표 글자가 최소 하나라도 있는지 검사
        for (const ch of txt.nodeValue){
          if (TARGETS.has(ch)) return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      }
    });

    const nodes = [];
    while (tw.nextNode()) nodes.push(tw.currentNode);

    for (const text of nodes){
      const frag = document.createDocumentFragment();
      let buf = "";

      const flushText = () => {
        if (buf) { frag.appendChild(document.createTextNode(buf)); buf = ""; }
      };

      for (const ch of Array.from(text.nodeValue)){
        if (TARGETS.has(ch)){
          flushText();
          const span = document.createElement("span");
          span.className = "han-target1";
          span.textContent = ch;
          frag.appendChild(span);
        } else {
          buf += ch;
        }
      }
      flushText();

      text.parentNode.replaceChild(frag, text);
    }
  }

  function runOnce(){
    const root = document.getElementById("flipbook");
    if (root) wrapSelectedHangul(root);
  }

  // 초기 1회 실행
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runOnce);
  } else {
    runOnce();
  }

  // turn.js로 동적으로 노드가 바뀔 수 있으니, 추가된 노드에만 재적용 (원하지 않으면 주석 처리)
  const root = document.getElementById("flipbook");
  if (root){
    const mo = new MutationObserver(muts=>{
      for (const m of muts){
        m.addedNodes && m.addedNodes.forEach(n=>{
          if (n.nodeType === 1) wrapSelectedHangul(n);
        });
      }
    });
    mo.observe(root, { childList: true, subtree: true });
  }
})();

	(function(){
  // 네가 보낸 긴 목록 그대로 붙여넣어도 됨.
  // (한글 완성형 블록(U+AC00–U+D7A3)만 추려서 Set에 넣기 때문에,
  //  뒤쪽 설명 문장 등은 자동 무시됨)
  const RAW = `개객갠갤갬갭갯갰갱걔걘걜게겐겔겜겝겟겠겡계곈곌곕곗괘괜괠괩괬괭궤궷깨깩깬깰깸깹깻깼깽께껙껜껨껫껭꼐꽤꽥꽹꿰꿱꿴꿸뀀뀁뀄내낵낸낼냄냅냇냈냉네넥넨넬넴넵넷넸넹녜녠눼대댁댄댈댐댑댓댔댕데덱덴델뎀뎁뎃뎄뎅뎨뎬돼됐뒈뒝때땍땐땔땜땝땟땠땡떼떽뗀뗄뗌뗍뗏뗐뗑뙈뛔래랙랜랠램랩랫랬랭레렉렌렐렘렙렛렝례롄롑롓뢨뤠매맥맨맬맴맵맷맸맹맺메멕멘멜멤멥멧멨멩몌뭬배백밴밸뱀뱁뱃뱄뱅뱉베벡벤벧벨벰벱벳벴벵볘볜봬뵀붸빼빽뺀뺄뺌뺍뺏뺐뺑뻬뼁새색샌샐샘샙샛샜생섀섄섈섐섕세섹센셀셈셉셋셌셍셰셴셸솅쇄쇈쇌쇔쇗쇘쉐쉑쉔쉘쉠쉥쌔쌕쌘쌜쌤쌥쌨쌩쎄쎈쎌쏀쐐쐤쒜애액앤앨앰앱앳앴앵얘얜얠얩에엑엔엘엠엡엣엥예옌옐옘옙옛옜왜왝왠왬왯왱웨웩웬웰웸웹웽재잭잰잴잼잽잿쟀쟁쟤쟨쟬제젝젠젤젬젭젯젱졔좨좼좽줴째짹짼쨀쨈쨉쨋쨌쨍쩨쩽쫴쬈채책챈챌챔챕챗챘챙체첵첸첼쳄쳅쳇쳉쳬쳰촁췌췐캐캑캔캘캠캡캣캤캥케켁켄켈켐켑켓켕켸쾌쾡퀘퀭태택탠탤탬탭탯탰탱테텍텐텔템텝텟텡톄톈퇘퉤패팩팬팰팸팹팻팼팽페펙펜펠펨펩펫펭폐폘폡폣해핵핸핼햄햅햇했행헤헥헨헬헴헵헷헹혜혠혤혭홰홱홴횃횅훼훽휀휄휑갣걥겍곘괢궸깯꺠꺤꽨꽸낻냬넫넾녱놰뇄댖됏뒙떄떈떔떙뙜랟랰랲럐럔렜뢔뤤맫맻맽멛멫몐뫠뫴밲밷뷁빾뻰샏섁섿셑셱솀솁쎅쎔쎼쒠쒬얬얭엤옏옝왭왰웻쟵좬쨰쩰쮀쮓쳊쵀췍췔캨켔켘켙퀜퀠턔텦퉷팯폔핻햋햏햬헀헸헿`;

  // 한글 완성형(AC00–D7A3)만 추려 Set 생성 (중복 자동 제거)
  const TARGETS = new Set(Array.from(RAW).filter(ch => {
    const cp = ch.codePointAt(0);
    return cp >= 0xAC00 && cp <= 0xD7A3;
  }));

  const SKIP_TAGS = new Set(["SCRIPT","STYLE","CODE","PRE","TEXTAREA","NOSCRIPT"]);

  function shouldSkip(node){
    for (let el = node.parentElement; el; el = el.parentElement){
      if (SKIP_TAGS.has(el.tagName)) return true;
      if (el.classList && (el.classList.contains("han-target2") || el.classList.contains("no-han-target"))) return true;
      if (el.isContentEditable) return true;
    }
    return false;
  }

  // 텍스트 노드의 "문자 단위"로 훑어서, 타깃이면 <span class="han-target">로 감싸기
  function wrapSelectedHangul(root){
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(txt){
        if (!txt.nodeValue) return NodeFilter.FILTER_REJECT;
        if (shouldSkip(txt)) return NodeFilter.FILTER_REJECT;
        // 빠르게 선별: 이 텍스트에 목표 글자가 최소 하나라도 있는지 검사
        for (const ch of txt.nodeValue){
          if (TARGETS.has(ch)) return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      }
    });

    const nodes = [];
    while (tw.nextNode()) nodes.push(tw.currentNode);

    for (const text of nodes){
      const frag = document.createDocumentFragment();
      let buf = "";

      const flushText = () => {
        if (buf) { frag.appendChild(document.createTextNode(buf)); buf = ""; }
      };

      for (const ch of Array.from(text.nodeValue)){
        if (TARGETS.has(ch)){
          flushText();
          const span = document.createElement("span");
          span.className = "han-target2";
          span.textContent = ch;
          frag.appendChild(span);
        } else {
          buf += ch;
        }
      }
      flushText();

      text.parentNode.replaceChild(frag, text);
    }
  }

  function runOnce(){
    const root = document.getElementById("flipbook");
    if (root) wrapSelectedHangul(root);
  }

  // 초기 1회 실행
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runOnce);
  } else {
    runOnce();
  }

  // turn.js로 동적으로 노드가 바뀔 수 있으니, 추가된 노드에만 재적용 (원하지 않으면 주석 처리)
  const root = document.getElementById("flipbook");
  if (root){
    const mo = new MutationObserver(muts=>{
      for (const m of muts){
        m.addedNodes && m.addedNodes.forEach(n=>{
          if (n.nodeType === 1) wrapSelectedHangul(n);
        });
      }
    });
    mo.observe(root, { childList: true, subtree: true });
  }
})();

	(function(){
  // 네가 보낸 긴 목록 그대로 붙여넣어도 됨.
  // (한글 완성형 블록(U+AC00–U+D7A3)만 추려서 Set에 넣기 때문에,
  //  뒤쪽 설명 문장 등은 자동 무시됨)
  const RAW = `가아고곡곤곧골곪곬곯곰곱곳공곶교굔굘굡굣구국군굳굴굵굶굻굼굽굿궁궂규균귤그극근귿글긁금급긋긍꼬꼭꼰꼲꼴꼼꼽꼿꽁꽂꽃꾜꾸꾹꾼꿀꿇꿈꿉꿋꿍꿎뀨끄끅끈끊끌끎끓끔끕끗끙끝나노녹논놀놂놈놉놋농높놓뇨뇩뇬뇰뇹뇻뇽누눅눈눋눌눔눕눗눙뉴뉵뉼늄늅늉느늑는늘늙늚늠늡늣능늦늪도독돈돋돌돎돐돔돕돗동돛돝됴두둑둔둘둠둡둣둥듀듄듈듐듕드득든듣들듦듬듭듯등또똑똔똘똥뚜뚝뚠뚤뚫뚬뚱뜨뜩뜬뜯뜰뜸뜹뜻로록론롤롬롭롯롱료룐룔룝룟룡루룩룬룰룸룹룻룽류륙륜률륨륩륫륭르륵른를름릅릇릉릊릍릎모목몫몬몰몲몸몹못몽묘묜묠묩묫무묵묶문묻물묽묾뭄뭅뭇뭉뭍뭏뮤뮨뮬뮴뮷므믄믈믐믓복볶본볼봄봅봇봉뵤뵨부북분붇불붉붊붐붑붓붕붙붚뷰뷴뷸븀븃븅브븍븐블븜븝븟소속솎손솔솖솜솝솟송솥쇼쇽숀숄숌숍숏숑수숙순숟술숨숩숫숭숯숱숲슈슉슐슘슛슝스슥슨슬슭슴습슷승쏘쏙쏜쏟쏠쏢쏨쏩쏭쑈쑤쑥쑨쑬쑴쑵쑹쓩쓰쓱쓴쓸쓺쓿씀씁오옥온옭옮옰옳옴옵옷옹옻요욕욘욜욤욥욧용우욱운울욹욺움웁웃웅유육윤율윰윱윳융윷으윽은을읊음읍읏응읒읓읔읕읖읗조족존졸졺좀좁좃종좆좇좋죠죡죤죵주죽준줄줅줆줌줍줏중쥬쥰쥴쥼즈즉즌즐즘즙즛증쪼쪽쫀쫄쫌쫍쫏쫑쫓쭁쭈쭉쭌쭐쭘쭙쭝쮸쯔쯤쯧쯩초촉촌촐촘촙촛총쵸춈추축춘출춤춥춧충츄츈츌츔츙츠측츤츨츰츱츳층코콕콘콜콤콥콧콩쿄쿠쿡쿤쿨쿰쿱쿳쿵토톡톤톨톰톱톳통톺툐투툭툰툴툼툽툿퉁튜튠튤튬튱트특튼튿틀틂틈틉틋포폭폰폴폼폽폿퐁표푠푤푭푯푸푹푼푿풀풂품풉풋풍퓨퓬퓰퓸퓻퓽프픈플픔픕픗하호혹혼홀홅홈홉홋홍홑효횬횰횹횻후훅훈훌훑훔훗훙휴휵휸휼흄흇흉흐흑흔흖흗흘흙흠흡흣흥흩곹굠굥궃귬귭긂긇긏긑긓꼳꽅꽌꿏꿏뀰뀼놁놑뇸눍눝뉻늗늧늫둗둚듥듧똠똡똣뚧뚯뜌뜳뜽뜾띃롣릏몯몱뮹믁믑믕볻볽볾볿뵴붔븁븕븡뽓뾱뿕뿝쁭솓숖슌슫슲쏚쓔씃옦옫옯욷웂웇윾읃읇읎쥭즁즒쫃쫒쬬쬭쬲쭛쯍쯕촣츅츩콛쿈큲킄톧툥툶틍틑퐅횽훍훐훓훕흝가각간갇갈갉갊갋감갑값갓갔강갖갗같갚갛개객갠갣갤갬갭갯갰갱갸갹갼걀걋걍걔걘걜걥거걱건걷걸걺검겁겂것겄겅겆겉겊겋게겍겐겔겜겝겟겠겡겨격겪견겯결겷겸겹겻겼경겿곁계곈곌곕곗곘고과곽관괄괆괌괍괏광괘괜괠괢괩괬괭괴괵괸괼굄굅굇굉교궈궉권궐궜궝궤궷궸귀귁귄귈귐귑귓기긱긴긷길긺김깁깃깄깅깆깊까깍깎깐깔깖깜깝깟깠깡깥깨깩깬깯깰깸깹깻깼깽꺄꺅꺆꺌꺍꺠꺤꺼꺽꺾껀껄껌껍껏껐껑껓껕께껙껜껨껫껭껴껸껼꼇꼈꼉꼍꼐꼬꾜끄끼끽낀낄낌낍낏낐낑나낙낚난낟날낡낢남납낫났낭낮낯낱낳내낵낸낻낼냄냅냇냈냉냐냑냔냗냘냠냡냣냥냬너넉넋넌넏널넑넒넓넘넙넛넜넝넢넣네넥넨넫넬넴넵넷넸넹넾녀녁년녇녈념녑녔녕녘녜녠녱노놈뇨느는니닉닌닏닐닒님닙닛닝닞닠닢다닽대댖댠댱더덯도들딫딮딲딷떄떈떔떙뚸뜄띡라러료르를리림마막만많맏말맑맒맘맙맛망맞맡맣매맥맨맬맴맵맷맸맹맺먀먁먈먕머먹먼멀멂멈멉멋멍멎멓메멕멘멜멤멥멧멨멩며멱면멸몃몄명몇몌모묘므미믹민믿밀밂밈밉밋밌밍및밑법사삭삯산삳살삵삶삼삽삿샀상샅샆새색샌샏샐샘샙샛샜생샤샥샨샬샴샵샷샹샾섀섁섄섈섐섕서석섞섟선섣설섦섧섬섭섯섰성섶세섹센섿셀셈셉셋셌셍셑셔셕션셜셤셥셧셨셩셰셱셴셸솀솁솅소쇼시식신싣실싫심십싯싱싶싸싹싻싼싿쌀쌈쌉쌌쌍쌓쌔쌕쌘쌜쌤쌥쌨쌩쌰쌱썅써썩썬썰썲썸썹썼썽쎂쎄쎅쎈쎌쎔쎠쎤쎵쎼쏀쏘쑈쒜쒸쓩씨씩씬씰씸씹씻씽아악안앉않앋알앍앎앏앓암압앗앙앜앝앞애액앤앨앰앱앳앴앵야약얀얄얇얌얍얏얐양얕얗얘얜얠얩어억언얹얻얼얽얾엄업없엇었엉엊엌엎에엑엔엘엠엡엣엥여역엮연열엶엷염엽엾엿였영옅옆옇예옌옐옘옙옛옜옝오요으의이익인읻일읽읾잃임입잇있잉잊잌잍잎자작잔잖잗잘잚잠잡잣잤장잦재잭잰잴잼잽잿쟀쟁쟈쟉쟌쟎쟐쟘쟝쟤쟨쟬쟵저적젂전젇절젉젊젋점접젓젔정젖제젝젠젤젬젭젯젱져젹젼졀졂졈졉졋졌졍졔조죠지직진짇질짊짐집짓짔징짖짗짙짚짜짝짠짢짣짤짧짬짭짯짰짱짲째짹짼쨀쨈쨉쨋쨌쨍쨔쨘쨤쨩쨰쩌쩍쩐쩔쩜쩝쩟쩠쩡쩨쩰쩽쪄쪘쪼쬬찌찍찐찓찔찜찝찟찡찢찦찧차착찬찮찰참찹찻찼창찾찿채책챈챌챔챕챗챘챙챠챤챦챨챰챵처척천철첨첩첫첬청체첵첸첼쳄쳅쳇쳉쳊쳐쳔쳡쳤쳥쳬쳰촁초추치칙친칟칠칡칢침칩칫칬칭칮칰카칵칸칻칼캄캅캇캉캐캑캔캘캠캡캣캤캥캨캬캭캰컁컄커컥컨컫컬컴컵컷컸컹컽케켁켄켈켐켑켓켔켕켘켙켜켠켤켬켭켯켰켱켸쿄크키킥킨킬킴킵킷킸킹탉트파팍팎판팓팔팖팜팝팟팠팡팤팥패팩팬팯팰팸팹팻팼팽퍄퍅퍝퍼퍽펀펄펌펍펏펐펑펖페펙펜펠펨펩펫펭펴펵편펼폄폅폈평폐폔폘폡폣포표프피픽핀필핌핍핏핑하학한할핥함합핫항핰핳해핵핸핻핼햄햅햇했행햋햏햐햔햣향햬헀허헉헌헐헒험헙헛헝헠헡헣헤헥헨헬헴헵헷헹헿혀혁현혈혐협혓혔형혜혠혤혭호화효흐히힉힌힐힘힙힛힜힝힣`;

  // 한글 완성형(AC00–D7A3)만 추려 Set 생성 (중복 자동 제거)
  const TARGETS = new Set(Array.from(RAW).filter(ch => {
    const cp = ch.codePointAt(0);
    return cp >= 0xAC00 && cp <= 0xD7A3;
  }));

  const SKIP_TAGS = new Set(["SCRIPT","STYLE","CODE","PRE","TEXTAREA","NOSCRIPT"]);

  function shouldSkip(node){
    for (let el = node.parentElement; el; el = el.parentElement){
      if (SKIP_TAGS.has(el.tagName)) return true;
      if (el.classList && (el.classList.contains("han-target3") || el.classList.contains("no-han-target"))) return true;
      if (el.isContentEditable) return true;
    }
    return false;
  }

  // 텍스트 노드의 "문자 단위"로 훑어서, 타깃이면 <span class="han-target">로 감싸기
  function wrapSelectedHangul(root){
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(txt){
        if (!txt.nodeValue) return NodeFilter.FILTER_REJECT;
        if (shouldSkip(txt)) return NodeFilter.FILTER_REJECT;
        // 빠르게 선별: 이 텍스트에 목표 글자가 최소 하나라도 있는지 검사
        for (const ch of txt.nodeValue){
          if (TARGETS.has(ch)) return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      }
    });

    const nodes = [];
    while (tw.nextNode()) nodes.push(tw.currentNode);

    for (const text of nodes){
      const frag = document.createDocumentFragment();
      let buf = "";

      const flushText = () => {
        if (buf) { frag.appendChild(document.createTextNode(buf)); buf = ""; }
      };

      for (const ch of Array.from(text.nodeValue)){
        if (TARGETS.has(ch)){
          flushText();
          const span = document.createElement("span");
          span.className = "han-target3";
          span.textContent = ch;
          frag.appendChild(span);
        } else {
          buf += ch;
        }
      }
      flushText();

      text.parentNode.replaceChild(frag, text);
    }
  }

  function runOnce(){
    const root = document.getElementById("flipbook");
    if (root) wrapSelectedHangul(root);
  }

  // 초기 1회 실행
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runOnce);
  } else {
    runOnce();
  }

  // turn.js로 동적으로 노드가 바뀔 수 있으니, 추가된 노드에만 재적용 (원하지 않으면 주석 처리)
  const root = document.getElementById("flipbook");
  if (root){
    const mo = new MutationObserver(muts=>{
      for (const m of muts){
        m.addedNodes && m.addedNodes.forEach(n=>{
          if (n.nodeType === 1) wrapSelectedHangul(n);
        });
      }
    });
    mo.observe(root, { childList: true, subtree: true });
  }
})();

