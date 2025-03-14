import { LanguageRegistry } from '@skills/data-access';
import { outdent } from 'outdent';

export type Template = [string, LanguageRegistry];

const workdayTemplate: Template = [
  'Workday 1-5',
  {
    en: {
      id: '',
      name: 'Workday',
      description: outdent`
    Workday's skill rating scale is used to:
      - assess and track an individual's skill development over time, 
      - identify skill gaps, provide targeted training and development opportunities, and 
      - make informed decisions related to job assignments, career growth, and talent management.
    `,
      totalLevelCount: 5,
      levels: [
        {
          id: '',
          name: 'Novice',
          description: outdent`
        This rating level indicates that an individual is in the early stages of developing the skill and has either limited knowledge or experience in applying it.           
        - requires significant guidance, and 
        - requires support to perform tasks related to the skill.
      `,
          value: 1,
        },
        {
          id: '',
          name: 'Developing',
          description: outdent`
        Individuals at this level are actively acquiring and expanding their knowledge and capabilities in the skill. 
        - demonstrates progress
        - may still need some guidance or supervision to perform tasks independently.
      `,
          value: 2,
        },
        {
          id: '',
          name: 'Proficient',
          description: outdent`
        This rating level signifies that an individual has achieved a satisfactory level of competency in the skill.  
        - possesses the required knowledge, and 
        - has the experience to perform tasks effectively and independently.
      `,
          value: 3,
        },
        {
          id: '',
          name: 'Advanced',
          description: outdent`
        Individuals at this level have demonstrated a high level of mastery and expertise in the skill. The individual consistently:
        - applies the skill in complex or challenging situations, 
        - shows innovative thinking, and 
        - contributes to the skill's advancement within the organization.
      `,
          value: 4,
        },
        {
          id: '',
          name: 'Expert',
          description: outdent`
        The highest rating level, "Expert," is reserved for individuals who have achieved the highest level of mastery and proficiency in the skill. 
        - possesses exceptional knowledge, experience, and abilities, and 
        - is recognized as a subject matter expert in the organization.
      `,
          value: 5,
        },
      ],
    },
  } satisfies LanguageRegistry,
];

const degreedTemplate: Template = [
  'Degreed 1-8',
  {
    en: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: 'Level 1',
          description:
            'You work best within a structured environment with supervision, predetermined processes, and set criteria to judge output against.',
          value: 1,
        },
        {
          id: '',
          name: 'Level 2',
          description:
            'You can solve basic problems and complete tasks on your own.\nWhen a complex issue arises, however, you will likely need some help.',
          value: 2,
        },
        {
          id: '',
          name: 'Level 3',
          description:
            'For the most part, you can work independently on new challenges. \n- You know enough about your skills to be self-critical\n- You know the difference between good work and great work. \n- You are good at setting your own goals to measure progress.',
          value: 3,
        },
        {
          id: '',
          name: 'Level 4',
          description:
            'You can work independently on complex projects. \n- You are able to look at your work and accurately evaluate whether it was successful. \n- You do not require supervision,\n- You value external input and feedback on your work.',
          value: 4,
        },
        {
          id: '',
          name: 'Level 5',
          description:
            'You can operate as a one-person show, which means you’re autonomous. \n- You can lead an initiative and see it through to the end with little to no supervision. \n- You can plan the process you’ll use, apply that plan, and evaluate its effectiveness \n- You consider alternatives and the potential outcomes.\n- You are trusted when it comes to your domain. \n- You are resource for ideas to situations or problems.\n- You provide insight or potential solutions when asked.',
          value: 5,
        },
        {
          id: '',
          name: 'Level 6',
          description:
            'You can work well independently on very complex projects. \n- You are good at communicating problems and potential solutions\n- You have applied your unique viewpoint to solve complicated issues, and \n- You innovate to help others the effort advance. \n- You can lead teams of practitioners.',
          value: 6,
        },
        {
          id: '',
          name: 'Level 7',
          description:
            'You’ve likely successfully led teams as they work on big initiatives that push the boundaries of your field. \n- You can do it all. \n- Your judgment is well-respected from those within your domain',
          value: 7,
        },
        {
          id: '',
          name: 'Level 8',
          description:
            'You are completely autonomous, and you are regarded as a domain leader and scholar. \n- You have your choice of projects, and \n- You likely select those projects that will allow you to create significant impact in the field and offer new ideas or practices.',
          value: 8,
        },
      ],
    },
    ar: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'أنت تعمل على أفضل وجه ممكن في البيئات المنظمة التي يتوافر فيها الإشراف والعمليات المحددة مسبقًا والمعايير المحددة التي يمكنك بناءً عليها الحكم على المخرجات.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description: 'يمكنك حل المشكلات البسيطة وإتمام المهام وحدك—ولكن عند ظهور مسائل معقدة، تكون في حاجة على الأرجح إلى بعض المساعدة.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'يمكنك العمل وحدك وبشكل مستقل على التحديات الجديدة. كما أنك تعرف ما يكفي عن مهاراتك بشكل يخولك ممارسة النقد الذاتي، وتعرف الفرق بين العمل الجيد والعمل الرائع. كما أنك أصبحت جيدًا أيضًا في وضع أهدافك الخاصة لقياس ما تحرزه من تقدم.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'يمكنك العمل بشكل مستقل على المشاريع المعقدة. وبعد انتهاءك منها، تكون قادرًا على النظر إلى عملك وتقييم مدى نجاحه من عدمه بشكل دقيق. وعلى الرغم من أن الإشراف عليك ليس ضروريًا، إلا أنك تقدّر المدخلات والملاحظات الخارجية بشأن جودة عملك.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'يمكنك مباشرة العمل والنهوض بكل أعباءه بمفردك، ما يعني أنك تتمتع بالاستقلالية. يمكنك قيادة أي مبادرة ومتابعتها حتى النهاية مع القليل من الإشراف أو بدونه. يمكنك تخطيط العملية التي ستستخدمها وتطبيق تلك الخطة وتقييم فعاليتها مع التفكير في الوقت ذاته في البدائل ونتائجها المحتملة.\nأنت محل ثقة على الأرجح فيما يتعلق بمجالك. قد يأتيك الآخرون بأفكار أو مواقف أو مشكلات ويطلبون رؤيتك أو حلولك الممكنة.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'يمكنك العمل على نحو جيد بشكل مستقل في المشاريع التي على درجة شديدة من التعقيد. وأنت تطبق منظورك الفريد لحل المشكلات المعقدة، كما تعتمد على الإبداع والابتكار للإسهام في تقدم المجال. وأنت بارع على الأرجح في التعبير عن المشكلات والحلول الممكنة لها، ويمكنك قيادة فرق من الممارسين.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'لقد نجحت على الأرجح في قيادة فرق أثناء عملها على مبادرات كبيرة توسع حدود مجالك. ويمكنك النهوض بكل ذلك— وسواء كنت لا تزال ممارسًا أو تقضي معظم وقتك في قيادة الآخرين، فإن أحكامك على الأمور تحظى باحترام كبير من العاملين بمجالك.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'أنت تتمتع بالاستقلالية الكاملة، وينظر إليك الجميع باعتبارك واحدًا من روّاد المجال وعلماءه. كما أنك تنتقي المشاريع التي تعمل بها، حيث تختار على الأرجح المشاريع التي تسمح لك بإحداث أثر كبير في المجال وطرح أفكار أو ممارسات جديدة.',
          value: 8,
        },
      ],
    },
    cs: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'Nejlépe se vám pracuje ve strukturovaném prostředí s dohledem a předem stanovenými postupy řešení základních problémů.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            'Základní problémy a úkoly zvládnete vyřešit sami, ale když se objeví složitý problém, budete pravděpodobně potřebovat pomoc.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'Na nových výzvách zvládáte většinou pracovat samostatně. Víte o svých dovednostech dost na to, abyste byli sebekritičtí a poznali rozdíl mezi dobrou a skvělou prací. Také jste se zdokonalili ve stanovování vlastních cílů pro měření pokroku.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'Dokážete pracovat samostatně na složitých projektech. Po dokončení těchto projektů se dokážete podívat na svoji práci a přesně zhodnotit, zda byla úspěšná. I když dohled není nutný, oceňujete externí vstupy a zpětnou vazbu.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'Zvládáte fungovat jako samostatná jednotka, což znamená, že jste autonomní. Dokážete vést iniciativu a dotáhnout ji do konce bez většího dohledu. Dokážete naplánovat postup, tento plán aplikovat a vyhodnotit jeho účinnost a zároveň zvážit alternativy a možné výsledky. Pokud jde o váš obor, je pravděpodobné, že se těšíte důvěře. Ostatní za vámi mohou přicházet s nápady, situacemi či problémy a ptát se vás na váš pohled nebo možná řešení.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'Dokážete ve velké míře nezávisle pracovat na velmi složitých problémech. Při řešení komplikovaných problémů uplatňujete svůj jedinečný úhel pohledu a uplatňujete inovace, abyste přispěli k rozvoji oboru. Pravděpodobně umíte dobře vysvětlovat problémy a potenciální řešení a dokážete vést týmy pracovníků, kteří práci v praxi odvádějí.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'Pravděpodobně jste úspěšně vedli týmy, které pracovaly na velkých iniciativách, jež posouvaly hranice vašeho oboru. A umíte to všechno – ať už jste stále praktici, nebo trávíte většinu času vedením ostatních, váš úsudek je lidmi z vašeho oboru respektován.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'Jste zcela samostatní a jste považováni za vůdčí osobnost v oboru a experta. Můžete si vybírat projekty a pravděpodobně si vyberete ty, které vám umožní významně ovlivnit danou oblast a nabídnout nové myšlenky nebo postupy.',
          value: 8,
        },
      ],
    },
    de: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'Am besten arbeitest du in einer strukturierten Umgebung unter Aufsicht, im Rahmen vorgegebener Prozesse und nach festgelegten Kriterien, anhand derer das Ergebnis beurteilt werden kann.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            'Du kannst grundlegende Probleme lösen und Aufgaben selbst erledigen. Bei komplexen Problemen brauchst du vermutlich noch Hilfe.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'In der Regel kannst du neue Herausforderungen eigenständig meistern. Du kennst deine Skills gut genug, um eine selbstkritische Haltung einnehmen zu können. Außerdem bist du in der Lage, gute von großartiger Arbeit zu unterscheiden. Mittlerweile setzt du dir auch gerne eigene Ziele, um deinen Fortschritt zu messen.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'Du kannst gut an komplexen Projekten arbeiten, und zwar unabhängig von anderen. Wenn diese Projekte abgeschlossen sind, kannst du deine Arbeit eigenständig betrachten und entsprechend beurteilen, ob sie erfolgreich war. Du benötigst keine Aufsicht, aber schätzt Meinungen von anderen und Rückmeldungen zu deiner Arbeit.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'Du kannst als „One-Man-Show“ agieren, das heißt, du bist autonom. Du kannst eine Initiative leiten und sie mit wenig bis gar keiner Aufsicht bis zum Ende durchziehen. Du kannst den Prozess, den du verwenden wirst, planen, diesen Plan anwenden und die Effektivität davon bewerten, während du Alternativen und die möglichen Ergebnisse berücksichtigst. dir wird wahrscheinlich vertraut, wenn es um deinen Bereich geht. Andere kommen vielleicht mit Ideen, Situationen oder Problemen zu dir und bitten dich um deine Einblicke oder mögliche Lösungen.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'Du kannst gut an sehr komplexen Projekten arbeiten, und zwar unabhängig von anderen. Du hast durch deine individuelle Sichtweise komplizierte Probleme gelöst und Innovationen entwickelt, die das Feld voranbringen. Du kannst Probleme und mögliche Lösungen vermutlich erfolgreich kommunizieren und fachliche Teams anleiten.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'Du hast wahrscheinlich erfolgreich Teams angeleitet, die an großen Initiativen zur Erweiterung deines Fachgebiets arbeiten. Du bist ein Allrounder. Unabhängig davon, ob du noch selbst in der Praxis tätig bist oder die meiste Zeit über andere anleitest: Dein Urteilsvermögen wird von Fachkollegen hoch geschätzt.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'Du agierst völlig autonom und giltst als Branchenkenner und Vordenker auf deinem Gebiet. Du kannst zwischen Projekten wählen und entscheidest dich mit hoher Wahrscheinlichkeit für jene, die signifikante Veränderungen auf dem jeweiligen Gebiet ermöglichen und den Weg für neue Ideen oder Praktiken ebnen.',
          value: 8,
        },
      ],
    },
    el: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'Εργάζεστε καλύτερα σε ένα συγκροτημένο περιβάλλον με επίβλεψη, προκαθορισμένες διαδικασίες και καθορισμένα κριτήρια έναντι των οποίων κρίνεται η παραγωγή.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            'Μπορείτε να επιλύετε βασικά προβλήματα και να ολοκληρώνετε εργασίες μόνοι σας – ωστόσο αν ανακύψει ένα σύνθετο ζήτημα, πιθανότατα θα χρειαστείτε κάποια βοήθεια.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'Ως επί το πλείστον, μπορείτε να εργάζεστε ανεξάρτητα σε νέες προκλήσεις. Γνωρίζετε αρκετά για τις δεξιότητές σας ώστε να μπορείτε να κάνετε αυτοκριτική, ενώ γνωρίζετε τη διαφορά μεταξύ καλής εργασίας και εξαιρετικής εργασίας. Επίσης, καταφέρνετε πλέον καλά να θέτετε τους δικούς σας στόχους ώστε να αξιολογείτε την πρόοδο.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'Μπορείτε να εργάζεστε ανεξάρτητα σε σύνθετα έργα. Όταν ολοκληρώνονται αυτά τα έργα, μπορείτε να εξετάζετε την εργασία σας και να αξιολογείτε με ακρίβεια εάν ήταν επιτυχής. Ενώ η επίβλεψη δεν είναι απαραίτητη, εκτιμάτε τις παρατηρήσεις και τα σχόλια για την εργασία σας από τρίτους.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'Μπορείτε να λειτουργείτε ατομικά, γεγονός που σημαίνει ότι διαθέτετε αυτονομία. Μπορείτε να ηγηθείτε μιας πρωτοβουλίας και να τη διεκπεραιώσετε έως το τέλος, με ελάχιστη έως καθόλου επίβλεψη. Μπορείτε να σχεδιάζετε τη διεργασία που θα χρησιμοποιήσετε, να εφαρμόζετε αυτό το πλάνο και να αξιολογείτε την αποτελεσματικότητά του, εξετάζοντας παράλληλα εναλλακτικές λύσεις και πιθανές εκβάσεις. Πιθανότατα σας εμπιστεύονται σε ζητήματα του τομέα σας. Άλλα άτομα μπορεί να έρχονται σε εσάς με ιδέες, ζητήματα ή προβλήματα και να ζητούν τη γνώμη σας ή πιθανές λύσεις.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'Μπορείτε να εργάζεστε ανεξάρτητα σε πολύ σύνθετα έργα. Έχετε εφαρμόσει τη μοναδική σας οπτική για επίλυση περίπλοκων ζητημάτων και καινοτομείτε ώστε να συμβάλλετε στην εξέλιξη του τομέα. Πιθανότατα μπορείτε να επικοινωνείτε αποτελεσματικά τα προβλήματα και τις πιθανές λύσεις και μπορείτε να ηγείστε ομάδων επαγγελματιών.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'Πιθανότατα έχετε ηγηθεί ομάδων επιτυχώς κατά την εργασία τους πάνω σε μεγάλες πρωτοβουλίες που διευρύνουν τα όρια του τομέα σας. Και μπορείτε να τα κάνετε όλα – είτε ασκείτε ακόμα το επάγγελμα είτε δαπανάτε το μεγαλύτερο μέρος του χρόνου σας καθοδηγώντας άλλους, τα άτομα του τομέα σας σέβονται απολύτως την κρίση σας.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'Είστε απολύτως αυτόνομοι και θεωρείστε ηγέτες και μελετητές του τομέα. Έχετε την επιλογή των έργων και πιθανότατα επιλέγετε εκείνα που θα σας επιτρέψουν να δημιουργήσετε σημαντικό αντίκτυπο στον τομέα και να προτείνετε νέες ιδέες ή πρακτικές.',
          value: 8,
        },
      ],
    },
    'en-GB': {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'You work best within a structured environment with supervision, pre-determined processes and set criteria to judge output against.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            "You can solve basic problems and complete tasks on your own — but when a complex issue arises, you'll probably need some help.",
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'For the most part, you can work independently on new challenges. You know enough about your skills to be self-critical, and know the difference between good work and great work. You’ve also become good at setting your own goals to measure progress.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'You can work independently on complex projects. When those projects are complete, you’re able to look at your work and accurately evaluate whether it was successful. Although supervision isn’t necessary, you value external input and feedback on your work.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'You can operate as a one-person show, which means that you’re autonomous. You can lead an initiative and see it through to the end with little to no supervision. You can plan the process that you’ll use, apply that plan and evaluate the effectiveness of it while considering alternatives and the potential outcomes.\nYou’re likely trusted when it comes to your domain. Others may come to you with ideas, situations or problems and ask for your insight or potential solutions.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'You can work well independently on very complex projects. You’ve applied your unique viewpoint to solve complicated issues, and you innovate to help the field advance. You’re probably good at communicating problems and potential solutions, and can lead teams of practitioners.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'You’ve probably successfully led teams as they work on big initiatives that push the boundaries of your field. And you can do it all — whether you’re still a practitioner or you spend the bulk of your time leading others, your judgment is well respected by those within your domain.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'You are completely autonomous, and you are regarded as a domain leader and academic. You have your choice of projects, and you probably select those that will allow you to create significant impact in the field and offer new ideas or practices.',
          value: 8,
        },
      ],
    },
    'en-JM': {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            '⁪⁪⁪‍‌​‍‌‌‍​​‌​​​‌​‌‍​‍‌​‌‌‍​​‍‌​‍‍‌‍‌‍​​‍​⁪You work best within a structured environment with supervision, predetermined processes, and set criteria to judge output against.⁪⁪',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            '⁪⁪⁪‌‍​‍​‌‍‌‍​‌‍‌​​‍‌​‍‌‌‌‍​​‍‌‍​​​‍‌​‍​‍‌‌​⁪You can solve basic problems and complete tasks on your own—but when a complex issue arises, you’ll likely need some help.⁪⁪',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            '⁪⁪⁪‌‍‌​‌​‌‌‌‍‌​​‍​‌‍‍‍‌‍​‍​‍​​‌‍​‍​‍‍‌‍‍​‌⁪For the most part, you can work independently on new challenges. You know enough about your skills to be self-critical, and know the difference between good work and great work. You’ve also become good at setting your own goals to measure progress.⁪⁪',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            '⁪⁪⁪‌​‍‍‍​‌​‌‍‌‌​​​‍‍‌‍‌​‍‍​‌​‍‌‌​‍​​​​‍‍‍​‍​⁪You can work independently on complex projects. When those projects are complete, you’re able to look at your work and accurately evaluate whether it was successful. While supervision isn’t necessary, you value external input and feedback on your work.⁪⁪',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            '⁪⁪⁪‌​‍‌​​‌​‍‌​​‍‌‌‍‍‍​‍‌‌​‍‍‌‍‍‌‍​‌​‍‌‌‍‌‌‌‌⁪You can operate as a one-person show, which means you’re autonomous. You can lead an initiative and see it through to the end with little to no supervision. You can plan the process you’ll use, apply that plan, and evaluate the effectiveness of it while considering alternatives and the potential outcomes.\nYou’re likely trusted when it comes to your domain. Others may come to you with ideas, situations, or problems and ask for your insight or potential solutions.⁪⁪',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            '⁪⁪⁪‍​‍‍‍‌​‍‌​​‌‍‍‌‌​‍‍​​​‍‌‍‌​‍‌‌​​‌‌‍​‍​‍‍⁪You can work well independently on very complex projects. You’ve applied your unique viewpoint to solve complicated issues, and you innovate to help the field advance. You’re likely good at communicating problems and potential solutions, and can lead teams of practitioners.⁪⁪',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            '⁪⁪⁪‍‌‍‌‌‌​‌​​‍‍‍​‌‍‍​‍​‍‌​‌​​​‍​​​​‌​​‌​‍​​⁪You’ve likely successfully led teams as they work on big initiatives that push the boundaries of your field. And you can do it all—whether you’re still a practitioner or you spend the bulk of your time leading others, your judgment is well-respected from those within your domain.⁪⁪',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            '⁪⁪⁪‌​​‍‍‍‌‌​‌​‍‍‍‌‍‍‍‍​​‍‍​‌‌‍​​‌​​​‍‍​‌‍​​‌⁪You are completely autonomous, and you are regarded as a domain leader and scholar. You have your choice of projects, and you likely select those that will allow you to create significant impact in the field and offer new ideas or practices.⁪⁪',
          value: 8,
        },
      ],
    },
    es: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'Trabajas mejor en un entorno estructurado con supervisión, procesos predeterminados y criterios establecidos para evaluar los resultados.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            'Puedes resolver problemas básicos y completar tareas por ti mismo; no obstante, cuando surgen problemas complejos, es probable que necesites un poco de ayuda.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'En la mayoría de las ocasiones, puedes trabajar independientemente en nuevos retos. Conoces bastante sobre tus habilidades para ser autocrítico, y conoces la diferencia entre un trabajo bueno y uno excelente. También has aprendido a establecer tus propias metas para medir tu progreso.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'Puedes trabajar de forma independiente en proyectos complejos. Una vez que los finalizas, puedes observar tu propio trabajo y evaluar con exactitud si es correcto. Aunque no necesitas supervisión, aprecias la retroalimentación y los comentarios sobre tu trabajo.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'Puedes trabajar de manera independiente, es decir, tienes autonomía. Puedes liderar una iniciativa y ponerla en práctica hasta el final con poca o ninguna supervisión. Puedes planificar el proceso que seguirás, aplicar dicho proceso y evaluar su eficacia, a la vez que tienes en cuenta alternativas y los posibles resultados.\nEs probable que los demás confíen en ti en relación con tu dominio. Es posible que otras personas te presenten ideas, situaciones o problemas para pedirte consejo o posibles soluciones.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'Puedes trabajar bien de manera independiente en proyectos muy complejos. Has aplicado un punto de vista único para resolver problemas complicados e innovas para que el campo avance. Probablemente, tienes facilidad para comunicar problemas y posibles soluciones, además de que puedes liderar equipos de profesionales.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'Es muy probable que hayas liderado con éxito equipos en grandes iniciativas que van allá de los límites de tu campo de dominio. Y puedes lograrlo todo: ya sea que todavía trabajes en la parte operativa o que dediques la mayor parte de tu tiempo a liderar a otros, tu criterio es muy respetado por quienes se encuentran dentro de tu dominio.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'Eres totalmente autónomo y se te considera como líder y académico en tu dominio. Puedes elegir proyectos, y probablemente selecciones los que te permitan generar un impacto significativo en el campo y ofrecer nuevas ideas o prácticas.',
          value: 8,
        },
      ],
    },
    'es-ES': {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'Trabajas mejor en un entorno estructurado sujeto a supervisión, procesos predeterminados y criterios establecidos para valorar los resultados.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            'Puede resolver problemas básicos y completar tareas por sí mismo; no obstante, cuando surgen problemas complejos, es probable que necesite ayuda.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'En general, puede trabajar independientemente en nuevos retos. Sabe lo suficiente sobre sus habilidades como para realizar autocríticas y conoce la diferencia entre un trabajo bueno y uno excelente. También ha aprendido a establecer sus propias metas para medir su progreso.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'Puedes trabajar de forma independiente en proyectos complejos. Una vez finalizados, puedes examinar el trabajo y determinar con precisión si es ha sido satisfactorio. Aunque no necesitas supervisión, valoras las opiniones y feedback de otras personas sobre tu trabajo.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'Trabajas de manera independiente, es decir, tienes autonomía. Puedes dirigir una iniciativa y llevarla a cabo hasta el final, con poca o ninguna supervisión. Planificas el proceso que seguirás, lo aplicas y valoras la eficacia, al mismo tiempo que te planteas otras alternativas y los posibles resultados.\nOtras personas probablemente confíen en ti en relación con cuestiones que estén bajo tu ámbito de competencia. Pueden acudir a ti con ideas, situaciones o problemas para los que necesitan orientación o una posible solución.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'Trabajas bien de manera autónoma en proyectos muy complejos. Aplicas tu propio criterio para resolver problemas complicados e innovas para impulsar avances en el sector. Probablemente, tienes facilidad para comunicar problemas y posibles soluciones, y puedes dirigir equipos de profesionales.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'Es probable que haya liderado equipos con éxito cuando estos trabajaban en grandes iniciativas que amplían los límites de su campo. Y puede hacerlo todo: tanto si sigue trabajando sobre su campo como si dedica la mayor parte del tiempo al liderazgo, los profesionales de su dominio respetan su juicio.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'Trabajas con autonomía y se te considera una figura líder y académica en tu dominio. Puedes elegir proyectos y probablemente seleccionarás los que te permitan generar un impacto significativo en el campo y ofrecer nuevas ideas o prácticas.',
          value: 8,
        },
      ],
    },
    'es-LA': {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'Trabajas mejor en un entorno estructurado con supervisión, procesos predeterminados y criterios establecidos para evaluar los resultados.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            'Puedes resolver problemas básicos y completar tareas por ti mismo; no obstante, cuando surgen problemas complejos, es probable que necesites un poco de ayuda.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'En la mayoría de las ocasiones, puedes trabajar independientemente en nuevos retos. Conoces bastante sobre tus habilidades para ser autocrítico, y conoces la diferencia entre un trabajo bueno y uno excelente. También has aprendido a establecer tus propias metas para medir tu progreso.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'Puedes trabajar de forma independiente en proyectos complejos. Una vez que los finalizas, puedes observar tu propio trabajo y evaluar con exactitud si es correcto. Aunque no necesitas supervisión, aprecias la retroalimentación y los comentarios sobre tu trabajo.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'Puedes trabajar de manera independiente, es decir, tienes autonomía. Puedes liderar una iniciativa y ponerla en práctica hasta el final con poca o ninguna supervisión. Puedes planificar el proceso que seguirás, aplicar dicho proceso y evaluar su eficacia, a la vez que tienes en cuenta alternativas y los posibles resultados.\nEs probable que los demás confíen en ti en relación con tu dominio. Es posible que otras personas te presenten ideas, situaciones o problemas para pedirte consejo o posibles soluciones.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'Puedes trabajar bien de manera independiente en proyectos muy complejos. Has aplicado un punto de vista único para resolver problemas complicados e innovas para que el campo avance. Probablemente, tienes facilidad para comunicar problemas y posibles soluciones, además de que puedes liderar equipos de profesionales.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'Es muy probable que hayas liderado con éxito equipos en grandes iniciativas que van allá de los límites de tu campo de dominio. Y puedes lograrlo todo: ya sea que todavía trabajes en la parte operativa o que dediques la mayor parte de tu tiempo a liderar a otros, tu criterio es muy respetado por quienes se encuentran dentro de tu dominio.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'Eres totalmente autónomo y se te considera como líder y académico en tu dominio. Puedes elegir proyectos, y probablemente selecciones los que te permitan generar un impacto significativo en el campo y ofrecer nuevas ideas o prácticas.',
          value: 8,
        },
      ],
    },
    fr: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'Vous préférez travailler dans un cadre structuré et supervisé doté de processus prédéterminés et de critères de productivité bien définis.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            'Vous êtes capable de résoudre des problèmes simples et d’accomplir des tâches en toute autonomie. Cependant, vous êtes susceptible d’avoir besoin d’aide si un problème plus compliqué surgit.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'Dans l’ensemble, vous êtes en mesure de relever de nouveaux défis sans avoir besoin d’aide. Vous maîtrisez vos compétences au point de savoir faire preuve d’autocritique et vous savez faire la différence entre bon et excellent travail. Vous vous fixez également désormais vos propres objectifs pour mesurer votre progression.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'Vous savez travailler en autonomie sur des projets complexes. Une fois ces projets achevés, vous êtes capable de prendre du recul et d’évaluer la qualité de votre travail. Bien qu’une supervision ne soit pas nécessaire, vous attachez de l’importance à l’avis de vos collègues concernant votre travail.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'Vous êtes autonome et menez votre propre barque. Vous prenez des initiatives et menez à bien vos projets sans ou avec très peu de supervision. Vous savez planifier votre méthode de travail et la mettre à exécution avant d’évaluer son efficacité. Vous êtes également capable d’envisager des processus alternatifs et d’entrevoir leurs résultats potentiels. Vous incarnez certainement une figure de confiance dans votre domaine, à tel point que vos pairs se tournent vers vous en cas de problème ou pour partager leurs idées afin d’avoir votre avis ou de solliciter votre aide.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'Vous savez travailler en autonomie sur des projets particulièrement complexes. Votre point de vue unique vous permet de résoudre des problèmes épineux et de proposer des innovations pour faire progresser votre domaine d’activité. Vous savez faire comprendre les problèmes, proposer des solutions et diriger une équipe de praticiens.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'Vous avez certainement été à la tête d’importants projets dont l’objectif était de repousser les limites de votre domaine. Que vous soyez praticien ou que vous occupiez un rôle de leader à temps plein, votre point de vue est respecté par tous les acteurs de votre domaine.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'Vous êtes totalement autonome et vos pairs vous considèrent comme un chercheur et un leader du secteur. Vous choisissez les projets sur lesquels vous souhaitez travailler et vous optez pour ceux qui vous permettront d’avoir un maximum d’impact dans votre domaine afin de proposer de nouvelles idées ou pratiques.',
          value: 8,
        },
      ],
    },
    'fr-CA': {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'Vous travaillez mieux dans un environnement structuré avec une supervision, des processus prédéterminés et des critères établis pour mesurer votre rendement.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            'Vous pouvez résoudre des problèmes de base et effectuer des tâches par vous-même, mais si un problème complexe se présente, vous aurez probablement besoin d’aide.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'De manière générale, vous pouvez affronter de nouveaux défis de manière indépendante. Vous en savez suffisamment sur vos compétences pour pouvoir vous remettre en question et vous connaissez la différence entre un bon travail et un excellent travail. Maintenant, vous êtes aussi capable d’établir vos propres objectifs afin de mesurer votre progrès.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'Vous pouvez travailler indépendamment sur des projets complexes. Une fois ceux-ci menés à terme, vous êtes en mesure de les étudier et d’évaluer la réussite de leur exécution. Bien qu’une supervision ne soit pas nécessaire, vous appréciez toujours les commentaires extérieurs et les retours sur votre travail.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'Vous êtes autonome et menez votre propre barque. Vous prenez des initiatives et menez à bien vos projets sans ou avec très peu de supervision. Vous savez planifier votre méthode de travail et la mettre à exécution avant d’évaluer son efficacité. Vous êtes également en mesure d’envisager d’autres processus et d’entrevoir leurs résultats potentiels.\nVous incarnez certainement une figure de confiance dans votre domaine, à tel point que vos pairs se tournent vers vous en cas de problème ou pour partager leurs idées afin d’avoir votre avis ou de solliciter votre aide.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'Vous travaillez bien de manière indépendante sur des projets très complexes. Vous mettez en application votre point de vue unique pour résoudre des problèmes compliqués et vous innovez pour faire avancer votre domaine. Vous êtes probablement habile pour communiquer des problèmes et des solutions possibles, et vous pouvez diriger des équipes de professionnels.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'Vous avez probablement mené avec succès des équipes alors qu’elles travaillaient à de grandes initiatives repoussant les limites de votre domaine. Et vous pouvez tout faire — que vous pratiquiez encore ou que vous passiez la majeure partie de votre temps à diriger les autres, votre jugement est très respecté par les gens de votre domaine.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'Vous êtes complètement autonome et l’on vous considère comme référence et spécialiste de votre domaine. Vous choisissez les projets sur lesquels vous voulez travailler et vous choisissez probablement ceux qui vous permettent d’avoir une incidence significative dans votre domaine et d’offrir de nouvelles idées ou de nouvelles pratiques.',
          value: 8,
        },
      ],
    },
    he: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description: 'הכי נוח לכם לעבוד בסביבה מובנית עם פיקוח, תהליכים קבועים מראש וקריטריונים מוגדרים לאומדן התוצאות על-פיהם.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description: 'יש לכם יכולת לפתור בעיות בסיסיות ולבצע מטלות בעצמכם, אבל אם עולות בעיות מורכבות, כנראה תצטרכו עזרה.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'עם מרבית האתגרים החדשים יש לכם יכולת להתמודד באופן עצמאי. המיומנויות שלכם ידועות לכם ברמה כזו שבאפשרותכם לבצע ביקורת עצמית ולדעת להבדיל בין עבודה טובה לבין עבודה מעולה. בנוסף, למדתם להגדיר לעצמכם יעדים כדי לאמוד את ההתקדמות שלכם.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'באפשרותכם לעבוד בצורה עצמאית על פרויקטים מורכבים. לאחר השלמת הפרויקטים, יש לכם יכולת לבחון את העבודה ולהעריך בצורה מדויקת אם ביצעתם אותה בהצלחה. פיקוח אינו הכרחי לכם, אך אתם מעריכים משוב ודעה של מישהו אחר.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'באפשרותכם לעשות הכל לבד, אתם אוטונומיים. באפשרותכם להוביל מהלך מתחילתו ועד סופו ללא פיקוח או עם מעט פיקוח. יש לכם יכולת לתכנן את התהליך, ליישם אותו ולאמוד את היעילות שלו, תוך חשיבה על חלופות ועל התוצאות הפוטנציאליות. ככל הנראה סומכים עליכם בכל הקשור לתחום שלכם. ייתכן שאחרים פונים אליכם עם רעיונות, בעיות או מצבים שהם נתקלים בהם כדי לשמוע את התובנות שלכם או פתרונות אפשריים.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'באפשרותכם לעבוד בצורה עצמאית על פרויקטים מורכבים במיוחד. פתרתם בעיות מורכבות תוך שימוש בנקודת מבט ייחודית לכם, והתחום מתפתח על בסיס חידושים שהכנסתם לשימוש. כפי הנראה אתם טובים בתקשורת לגבי בעיות ופתרונות פוטנציאליים, וכן להנחות צוותים של מומחים.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'סביר להניח שהובלתם צוותים בעבודה על פרויקטים רציניים, תוך פריצת "תקרת הזכוכית" של התחום. בין אם בשלב התלמדות ובין אם בניהול של אחרים, סומכים מאוד על דעתכם.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'עבודתכם עצמאית לחלוטין, וסומכים עליכם כמובילים ומנחים בתחום. הפרויקטים שלכם נבחרים בפינצטה על-ידכם על בסיס השיקול של יצירת ההשפעה המשמעותית ביותר והצגת רעיונות חדשים או שיטות עבודה חדשות.',
          value: 8,
        },
      ],
    },
    hu: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'Legjobban strukturált környezetben, felügyelet mellett dolgozik előre meghatározott folyamatokon olyan ismert kritériumokkal, amelyek segítenek a teljesítménye mérésében.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            'Meg tudja oldani az alapvető problémákat, és önállóan elvégzi a feladatokat, de összetett problémák felmerülésekor valószínűleg segítségre lesz szüksége.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'Többnyire képes önállóan dolgozni az új kihívásokon. Ismeri annyira a készségeit, hogy elbírálja magát, és felismerje a különbséget a jó és a nagyszerű munka között. Már fejlődött annyit, hogy saját célok felállításával mérje a haladását.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'Tud önállóan dolgozni összetett projekteken. A projektek befejezése után vissza tud tekinteni a munkájára, és pontosan fel tudja mérni, hogy az sikeres volt-e. Bár nincs szüksége felügyeletre, értékeli a munkájára adott visszajelzéseket és a külső hozzájárulást.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'Egyedül is felelősséget tud vállalni a feladatokért, tehát önálló. Képes végigvezetni egy kezdeményezést kevés felügyelet mellett, vagy akár anélkül is. A használt folyamatokat megtervezi, követi, és felméri a hatékonyságukat, eközben szem előtt tartja az alternatívákat és lehetséges kimeneteleket.\nA szakterületén valószínűleg megbíznak Önben. Mások Önhöz fordulhatnak ötletekkel, helyzetekkel és problémákkal, hogy megossza velük a véleményét vagy a lehetséges megoldásokat.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'Jól tud önállóan dolgozni nagyon összetett projekteken. Az egyedi nézőpontja alkalmazásával megoldja a bonyolult feladatokat, és újít, hogy a szakterülete fejlődjön. Valószínűleg jól kommunikálja a problémákat és a lehetséges megoldásokat, és több csapat vezetésére is képes.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'Valószínűleg már sikeresen vezetett csapatokat, akik a szakterülete határait feszegető nagy léptékű kezdeményezéseken dolgoztak. Ön képes mindenre – akár maga végzi el a munkát, akár mások vezetésével tölti az ideje nagy részét, a döntéseit tiszteletben tartják a területén dolgozók.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'Teljesen önállóan is elvégzi a feladatot, a területen vezetőnek és szakembernek tartják. Lehetősége van több projekt közül választani, és valószínűleg olyan mellett kötelezi el magát, amelyikkel jelentős hatása lehet a területen, illetve új ötleteket és gyakorlatokat nyújthat.',
          value: 8,
        },
      ],
    },
    id: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'Anda bekerja paling baik dalam lingkungan yang terstruktur dengan pengawasan, proses yang telah ditentukan, dan menetapkan kriteria untuk menilai hasil.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            'Anda dapat menyelesaikan masalah dasar dan menyelesaikan tugas Anda sendiri—tetapi ketika muncul masalah yang kompleks, Anda mungkin membutuhkan bantuan.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'Sebagian besarnya, Anda dapat mengerjakan tantangan baru secara mandiri. Anda cukup tahu tentang keterampilan Anda untuk menjadi kritis terhadap diri sendiri, dan tahu perbedaan antara kerja bagus dan kerja luar biasa. Anda juga menjadi cakap dalam menetapkan tujuan Anda sendiri untuk mengukur kemajuan.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'Anda dapat mengerjakan proyek yang kompleks secara mandiri. Saat proyek tersebut selesai, Anda dapat melihat pekerjaan Anda dan mengevaluasi secara akurat apakah telah berhasil. Meskipun tidak diperlukan pengawasan, Anda menghargai masukan dan umpan balik dari luar untuk pekerjaan Anda.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'Anda dapat berjalan sebagai performa solo, yang artinya Anda mandiri. Anda dapat memimpin sebuah inisiatif dan menyaksikannya sampai akhir dengan sedikit atau tanpa pengawasan. Anda dapat merencanakan proses yang akan Anda gunakan, menerapkan rencana tersebut, dan mengevaluasi keefektifannya sekaligus mempertimbangkan alternatif dan hasil potensial. Anda mungkin dipercaya jika berhubungan dengan domain Anda. Orang lain mungkin mendatangi Anda dengan ide, situasi, atau masalah dan meminta wawasan atau solusi potensial Anda.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'Anda dapat mengerjakan proyek yang kompleks secara mandiri dengan baik. Anda telah menerapkan sudut pandang Anda yang unik untuk memecahkan masalah rumit, dan Anda berinovasi untuk membantu kemajuan bidang. Anda cenderung pandai mengkomunikasikan masalah dan potensi solusi, serta dapat memimpin tim praktisi.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'Anda kemungkinan besar berhasil memimpin tim saat mereka mengerjakan inisiatif besar yang mendorong batas-batas bidang Anda. Dan Anda dapat melakukan semuanya—entah Anda masih seorang praktisi atau menghabiskan sebagian besar waktu Anda untuk memimpin orang lain, penilaian Anda sangat dihargai oleh orang-orang yang ada dalam domain Anda.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'Anda sepenuhnya otonom, dan Anda dianggap sebagai pemimpin dan pakar domain. Anda memiliki proyek pilihan Anda, dan kemungkinan besar Anda memilih proyek yang memungkinkan Anda menciptakan pengaruh yang signifikan di lapangan dan menawarkan ide atau praktik baru.',
          value: 8,
        },
      ],
    },
    it: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'Lavori meglio in un ambiente strutturato con supervisione, processi predeterminati e criteri fissati per giudicare i risultati.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            'Sei in grado di risolvere problemi di base e completare le attività in autonomia, ma quando si verifica un problema complesso, probabilmente avrai bisogno di aiuto.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'Per la maggior parte, puoi lavorare in modo indipendente su nuove sfide. Conosci abbastanza le tue skill per essere autocritico e conosci la differenza tra un buon lavoro e un ottimo lavoro. Sei diventato anche bravo a stabilire i tuoi obiettivi per misurare i progressi.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'Sei in grado di lavorare in modo indipendente su progetti complessi. Quando questi progetti sono completi, puoi esaminare il tuo lavoro e valutare con precisione se ha avuto successo. Sebbene la supervisione non sia necessaria, apprezzi l’input esterno e il feedback sul tuo lavoro.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'Puoi agire esponendoti personalmente, e ciò significa che sei autonomo. Puoi guidare un’iniziativa e portarla fino alla fine con poca o nessuna supervisione. Puoi pianificare il processo che utilizzerai, applicare quel piano e valutarne l’efficacia, considerando le alternative e i potenziali risultati. Probabilmente sei considerato affidabile quando si tratta del tuo settore. Altri potrebbero rivolgersi a te con idee, situazioni o problemi e chiedere il tuo parere o potenziali soluzioni.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'Sei in grado di lavorare in modo indipendente su progetti molto complessi. Hai applicato il tuo punto di vista unico per risolvere problemi complicati e hai innovato per contribuire ai progressi nel tuo campo. Probabilmente sei bravo a comunicare problemi e potenziali soluzioni e puoi guidare dei team di professionisti.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'Probabilmente hai guidato con successo dei team mentre lavorano su iniziative importanti che ampliano i confini del tuo campo. E puoi fare tutto questo: che tu sia ancora un praticante o che passi la maggior parte del tuo tempo a guidare gli altri, il tuo giudizio è ben rispettato da chi risiede nel tuo ambito.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'Sei completamente autonomo e sei considerato un leader nel tuo ambito e uno studioso. Hai la tua scelta di progetti e probabilmente selezioni quelli che ti permetteranno di creare un impatto significativo sul campo e di offrire nuove idee o pratiche.',
          value: 8,
        },
      ],
    },
    ja: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description: '監督者がおり、あらかじめ定められたプロセス、成果判定のための基準が設定された職場環境で最も力を発揮します。',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            '基本的な問題を解決し、自分自身でタスクを完了できるものの、複雑な問題が生じた場合には一部サポートが必要となることもあります。',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            '新しい課題の大半に一人で取り組むことができます。自分自身のスキルを十分に把握し、自己批判の視点を持つことができ、良い仕事と優れた仕事の差を理解しています。また、進捗度を測るために自身の目標を設定する能力も習得しています。',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            '複雑なプロジェクトに一人で取り組むことができます。プロジェクトの完了後に自分の業務内容を確認し、その成否を正確に評価することができます。監督は必須ではありませんが、自分の仕事に対する外部からのアドバイスやフィードバックを重要視しています。',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            '自分自身で業務を進めることができ、自律的です。監督がほとんど、またはまったくない状態で取り組みを率先し、完了させることができます。使用するプロセスを計画し、その計画を実践し、その実効性を代替策や考えられる結果と併せて評価することができます。\nおそらく担当分野において信頼おける人とみなされており、他のメンバーからアイデア、状況や問題に関して相談を受け、助言や考えられる解決案などを求められることもあるでしょう。',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            '非常に複雑なプロジェクトに一人で十分に取り組むことができます。独自の視点を用いて複雑な課題を解決し、対象分野の進展のために革新を実現することができます。問題や考えられる解決策を伝えるのもおそらく得意で、実習中のチームを率いることができます。',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            '担当分野の限界に挑むような大規模な施策に取り組むチームを成功裏に率いた経験があり、まだ実務に励んでいる身でも、メンバーを率いる管理職としても通用する幅広い能力を持ちます。担当分野の他のプレイヤーからもあなたの意思決定は大いに尊重されています。',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            '他の人のサポートなしで自律的に行動でき、分野におけるリーダーであり専門知識の持ち主だと見なされています。自分で取り組みたいプロジェクトを担当し、その際には担当分野に大きな影響を及ぼし、新しいアイデアや実践への道を拓くプロジェクトを選択する可能性が高いでしょう。',
          value: 8,
        },
      ],
    },
    ko: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description: '감독 및 미리 결정된 절차, 결과를 판단하는 정해진 기준이 갖추어진 구조화된 환경에서 가장 잘 일합니다.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            '스스로 간단한 문제를 해결하고 작업을 완료할 수 있으나 복잡한 문제가 발생하면 어느 정도 도움이 필요할 가능성이 높습니다.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            '대부분의 경우, 새로운 도전 과제에 대해 독립적으로 일할 수 있습니다. 비판적으로 생각할 수 있을 만큼 자신의 기술에 대해 잘 알며, 잘한 일과 훌륭한 일의 차이점을 압니다. 자신만의 목표 설정을 통해 진행 상황을 측정하는 것에 능숙합니다.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            '복잡한 프로젝트에 대한 업무를 독립적으로 수행할 수 있습니다. 프로젝트가 완료되었을 때, 자신의 일을 검토하고 성공적이었는지 정확하게 평가할 수 있습니다. 감독이 필요하진 않지만 자신의 일에 대한 외부 의견과 피드백을 가치있게 생각합니다.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            '혼자서 모든 일을 담당할 수 있으며, 이것은 당신이 자율적이라는 것을 나타냅니다. 감독이 거의 또는 전혀 없이 솔선해서 일을 끝까지 마무리할 수 있습니다. 사용하고자 하는 프로세스를 계획하고, 해당 계획을 적용하고, 그것의 효과성을 평가하면서 대안책과 잠재적 결과를 고려할 수 있습니다.\n자신의 영역에 있어 타인으로부터 신뢰받을 가능성이 높습니다. 타인이 아이디어, 상황, 또는 문제를 가지고 찾아올 수 있으며, 당신의 의견이나 잠재적 해결책을 물을 수 있습니다.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            '매우 복잡한 프로젝트에 대한 업무를 독립적으로 잘 수행할 수 있습니다. 독자적인 관점을 적용해 복잡한 문제를 해결했으며, 해당 분야의 발전을 돕기 위해 혁신합니다. 문제와 잠재적 해결책에 관하여 훌륭하게 소통할 가능성이 높고 현역 전문가 팀을 이끌 수 있습니다.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            '자신의 팀이 해당 분야의 경계를 넘어서는 큰 계획 업무를 진행해나가는 과정에서 팀을 성공적으로 이끌었을 가능성이 높습니다. 그리고 당신은 그 모든 것을 다 해낼 수 있습니다. 아직 현역 전문가이든 오랜 시간 동안 타인을 이끌어 왔든, 당신의 판단력은 자신의 전문영역에 속한 타인으로부터 크게 존중받습니다.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            '완전히 자율적이고 해당 분야의 주도자이자 전문가로 여겨집니다. 자신이 프로젝트를 선택할 수 있고, 본인이 해당 분야에 상당한 영향을 미칠 수 있고 새로운 아이디어나 관례를 제공하는 프로젝트를 선택할 가능성이 높습니다.',
          value: 8,
        },
      ],
    },
    nl: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'Je werkt het beste in een gestructureerde omgeving met toezicht, vooraf bepaalde processen en vaste criteria om je output te beoordelen.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            'Je kunt zelfstandig eenvoudige problemen oplossen en taken voltooien, maar als er zich complexe problemen voordoen, heb je waarschijnlijk wat hulp nodig.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'Je kunt over het algemeen onafhankelijk aan nieuwe uitdagingen werken. Je hebt voldoende kennis over je skills om zelfkritisch te zijn en kent het verschil tussen goed werk en uitstekend werk. Je bent ook goed geworden in het stellen van je eigen doelen om vooruitgang te meten.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'Je kunt onafhankelijk aan complexe projecten werken. Als deze projecten zijn voltooid, ben je in staat om naar je eigen werk te kijken en dit nauwkeurig zelf te beoordelen. Hoewel toezicht niet noodzakelijk is, waardeer je externe input en feedback op je werk.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'Je kunt volledig zelfstandig werken, wat betekent dat je autonoom bent. Je kunt een initiatief leiden en dit tot het einde volbrengen met weinig tot geen toezicht. Je kunt het proces dat je gaat gebruiken plannen, het plan toepassen en de effectiviteit ervan beoordelen terwijl je rekening houdt met alternatieven en de potentiële resultaten.\nAnderen vertrouwen op jou als het om jouw vakgebied gaat. Anderen kunnen naar je toe komen met ideeën, situaties of problemen en vragen om jouw inzicht of potentiële oplossingen.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'Je kunt goed zelfstandig aan zeer complexe projecten werken. Je hebt je unieke standpunt toegepast om ingewikkelde problemen op te lossen en je innoveert om jouw vakgebied verder te helpen groeien. Je bent waarschijnlijk goed in het communiceren van problemen en mogelijke oplossingen, en kunt leiding geven aan teams van vakmensen.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'Je hebt waarschijnlijk met succes leiding gegeven aan teams die aan grote initiatieven werkten die grensverleggend zijn binnen je vakgebied. Je kunt het allemaal, of je nou zelf nog actief bent of het grootste gedeelte van je tijd besteedt aan het leidinggeven aan anderen: jouw oordeel wordt gerespecteerd door de mensen in je vakgebied.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'Je bent volledig autonoom en wordt als leider en deskundige gezien binnen jouw vakgebied. Je hebt de keuze uit projecten en kunt waarschijnlijk de projecten uitkiezen waarmee je een significante impact kunt hebben in je vakgebied en nieuwe ideeën of best practices kunt helpen vormgeven.',
          value: 8,
        },
      ],
    },
    pl: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'Osiągasz najlepsze wyniki pracy w uporządkowanym środowisku pod nadzorem, w ramach wstępnie ustalonych procesów oraz kryteriów oceny rezultatów.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            'Potrafisz rozwiązywać podstawowe problemy i samodzielnie realizować zadania – lecz w przypadku złożonych problemów zapewne będziesz potrzebować pomocy.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'W większości przypadków potrafisz pracować niezależnie nad nowymi wyzwaniami. Masz wystarczającą wiedzę na temat swoich umiejętności, aby krytycznie ocenić własne rezultaty oraz odróżnić dobrą pracę od wzorowej. Potrafisz także skutecznie wyznaczać swoje cele, aby mierzyć postępy.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'Potrafisz samodzielnie pracować nad złożonymi projektami. Po ukończeniu tych projektów potrafisz spojrzeć na swoją pracę i trafnie ocenić, czy zakończyła się sukcesem. Choć nadzór nie jest konieczny, cenisz opinie i sugestie innych osób dotyczące Twojej pracy.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'Potrafisz działać jako jednoosobowy zespół, co oznacza pełną samodzielność. Potrafisz pokierować inicjatywą oraz doprowadzić ją do końca przy minimalnym nadzorze lub całkowicie bez nadzoru. Potrafisz zaplanować proces, którego użyjesz, wprowadzić ten plan w życie oraz ocenić jego skuteczność, biorąc pod uwagę alternatywy oraz potencjalne rezultaty.\nNajprawdopodobniej jesteś zaufaną osobą w swojej dziedzinie. Inne osoby mogą zwracać się do Ciebie z pomysłami, sytuacjami lub problemami oraz prosić Cię o podzielenie się spostrzeżeniami lub potencjalnymi rozwiązaniami.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'Potrafisz skutecznie pracować samodzielnie nad bardzo złożonymi projektami. Z powodzeniem stosujesz swój unikatowy punkt widzenia do rozwiązywania skomplikowanych problemów oraz wprowadzasz innowacje, aby wspierać rozwój dziedziny. Prawdopodobnie dobrze radzisz sobie z przekazywaniem informacji o problemach i potencjalnych rozwiązaniach oraz potrafisz kierować zespołem praktyków.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'Prawdopodobnie masz doświadczenie w skutecznym kierowaniu zespołami pracującymi nad ambitnymi inicjatywami, które przyczyniają się do rozwoju Twojej dziedziny. Potrafisz zająć się wszystkim – niezależnie od tego, czy nadal zajmujesz się pracą praktyczną, czy kierujesz innymi osobami, Twoja opinia cieszy się powszechnym szacunkiem osób z Twojej dziedziny.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'Jesteś osobą całkowicie samodzielną, traktowaną jako lider i badacz w swojej dziedzinie. Masz możliwość wyboru projektów oraz prawdopodobnie wybierzesz te, które pozwolą Ci wnieść znaczący wkład w swoją dziedzinę oraz zaoferują nowe pomysły i praktyki.',
          value: 8,
        },
      ],
    },
    pt: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'Você trabalha melhor em um ambiente estruturado com supervisão, processos predeterminados e critérios definidos para avaliação de resultados.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            'Você consegue resolver problemas básicos e realizar tarefas de forma independente, mas diante de um problema complexo, é provável que precise de ajuda.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'Na maioria das vezes, você consegue trabalhar de forma independente em novos desafios. Você conhece suas habilidades o suficiente para ser autocrítico e conhece a diferença entre um bom trabalho e um ótimo trabalho. Você também adquiriu experiência no estabelecimento dos seus próprios objetivos para medir o seu progresso.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'Você consegue trabalhar com independência em projetos complexos. Com os projetos concluídos, você consegue analisar o seu trabalho e avaliar com precisão se tiveram sucesso. Embora não haja necessidade de supervisão, você valoriza as opiniões e os feedbacks externos sobre o seu trabalho.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'Você consegue trabalhar sozinho(a), ou seja, tem autonomia. Consegue liderar uma iniciativa até o fim com pouca ou nenhuma supervisão. Consegue planejar o processo que vai utilizar, aplicar o plano traçado e avaliar a eficácia, analisando alternativas e possíveis resultados. É provável que você seja uma pessoa conceituada na sua área de atuação, procurada por outras pessoas para dar opiniões ou oferecer soluções para ideias, situações ou problemas.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'Você trabalha bem com independência em projetos muito complexos. Você já aplicou seu ponto de vista singular na solução de problemas complexos e inova para estimular o progresso do seu campo de atuação. É provável que você comunique bem os problemas e suas possíveis soluções e que consiga liderar equipes de profissionais.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'Você provavelmente lidera equipes com sucesso quando elas trabalham em grandes iniciativas que ampliam os limites da sua área. E você ainda é capaz de fazer de tudo, independentemente de ser ainda um profissional atuante ou de passar a maior parte do tempo liderando outras pessoas. Sua opinião é respeitada pelas pessoas da sua área.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'Você é completamente autônomo e é considerado um líder e estudioso na sua área. Você escolhe seus projetos e provavelmente seleciona aqueles que permitirão criar impacto significativo na área e oferecer novas ideias ou práticas.',
          value: 8,
        },
      ],
    },
    'pt-BR': {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'Você trabalha melhor em um ambiente estruturado com supervisão, processos predeterminados e critérios definidos para avaliação de resultados.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            'Você consegue resolver problemas básicos e realizar tarefas de forma independente, mas diante de um problema complexo, é provável que precise de ajuda.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'Na maioria das vezes, você consegue trabalhar de forma independente em novos desafios. Você conhece suas habilidades o suficiente para ser autocrítico e conhece a diferença entre um bom trabalho e um ótimo trabalho. Você também adquiriu experiência no estabelecimento dos seus próprios objetivos para medir o seu progresso.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'Você consegue trabalhar com independência em projetos complexos. Com os projetos concluídos, você consegue analisar o seu trabalho e avaliar com precisão se tiveram sucesso. Embora não haja necessidade de supervisão, você valoriza as opiniões e os feedbacks externos sobre o seu trabalho.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'Você consegue trabalhar sozinho(a), ou seja, tem autonomia. Consegue liderar uma iniciativa até o fim com pouca ou nenhuma supervisão. Consegue planejar o processo que vai utilizar, aplicar o plano traçado e avaliar a eficácia, analisando alternativas e possíveis resultados. É provável que você seja uma pessoa conceituada na sua área de atuação, procurada por outras pessoas para dar opiniões ou oferecer soluções para ideias, situações ou problemas.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'Você trabalha bem com independência em projetos muito complexos. Você já aplicou seu ponto de vista singular na solução de problemas complexos e inova para estimular o progresso do seu campo de atuação. É provável que você comunique bem os problemas e suas possíveis soluções e que consiga liderar equipes de profissionais.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'Você provavelmente lidera equipes com sucesso quando elas trabalham em grandes iniciativas que ampliam os limites da sua área. E você ainda é capaz de fazer de tudo, independentemente de ser ainda um profissional atuante ou de passar a maior parte do tempo liderando outras pessoas. Sua opinião é respeitada pelas pessoas da sua área.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'Você é completamente autônomo e é considerado um líder e estudioso na sua área. Você escolhe seus projetos e provavelmente seleciona aqueles que permitirão criar impacto significativo na área e oferecer novas ideias ou práticas.',
          value: 8,
        },
      ],
    },
    'pt-PT': {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'Trabalha melhor num ambiente estruturado com supervisão, processos predeterminados e critérios definidos para avaliar os resultados.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            'Consegue resolver problemas básicos e completar tarefas por conta própria, mas quando surgir um problema complexo, provavelmente vai precisar de alguma ajuda.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'Na maior parte do tempo, consegue trabalhar de forma independente em novos desafios. Conhece suficientemente bem as suas competências para ter autocrítica e conhece a diferença entre um bom trabalho e um excelente trabalho. Também adquiriu boas capacidades para estabelecer os seus próprios objetivos para medir o progresso.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'É capaz de trabalhar de forma autónoma em projetos complexos. Quando os projetos estão concluídos, é capaz de olhar para o seu trabalho e avaliar com precisão se foi realizado com êxito. Embora não necessite de supervisão, valoriza as contribuições externas e os comentários sobre o seu trabalho.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'É capaz de trabalhar só, o que demonstra a sua autonomia. É capaz de liderar uma iniciativa até ao fim com pouca ou nenhuma supervisão. É capaz de planear o processo que vai utilizar, aplicar esse plano e avaliar a eficácia do mesmo, enquanto considera alternativas e os possíveis resultados.\nÉ provável que confiem em si quando se trata da sua área. As outras pessoas podem dirigir-se a si para apresentar ideias, situações ou problemas e pedir a sua opinião ou possíveis soluções.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'É capaz de trabalhar bem de forma autónoma em projetos muito complexos. Aplicou o seu ponto de vista único para resolver questões complicadas e inova para ajudar a área a avançar. Provavelmente, sabe comunicar bem problemas e possíveis soluções e é capaz de liderar equipas de profissionais.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'É provável que tenha liderado com êxito equipas enquanto trabalhavam em grandes iniciativas que expandem os limites da sua área. E consegue fazer tudo, quer ainda seja um profissional ou passe a maior parte do seu tempo a liderar outros, o seu julgamento é bem respeitado por aqueles na sua área.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'Tem autonomia total e é considerado um líder e académico no seu domínio. Tem a possibilidade de escolher os seus projetos e provavelmente seleciona aqueles que lhe permitirão criar um impacto significativo no terreno e oferecer novas ideias ou práticas.',
          value: 8,
        },
      ],
    },
    ro: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'Lucrezi cel mai bine într-un mediu structurat cu supraveghere, procese predeterminate și criterii fixe în raport cu care sunt analizate rezultatele.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            'Poți rezolva probleme de bază și poți finaliza activități în mod independent. Însă, când apare o problemă complexă, probabil vei avea nevoie de un oarecare ajutor.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'În general, poți lucra independent în privința unor noi provocări. Cunoști suficient de multe lucruri despre competențele tale pentru a putea fi autocritic(ă) și cunoști diferența dintre o muncă bună și o muncă excelentă. De asemenea, îți poți stabili bine propriile obiective, pentru a-ți măsura progresul.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'Poți lucra independent în proiecte complexe. Când aceste proiecte au fost finalizate, poți analiza munca depusă și poți evalua exact dacă a avut sau nu succes. Chiar dacă supravegherea nu este necesară, apreciezi punctele de vedere externe și feedbackul pe marginea activității tale.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'Poți acționa pe cont propriu, ceea ce înseamnă că ești autonom(ă). Poți conduce o inițiativă până la final cu minimum de supraveghere sau chiar deloc. Poți planifica procesul pe care îl vei folosi, poți pune planul în aplicare și îi poți evalua eficacitatea, luând în considerare alternativele și rezultatele potențiale.\nFoarte probabil ești de încredere când vine vorba despre domeniul în care lucrezi. Alte persoane îți pot transmite idei, situații sau probleme și îți pot cere opinia sau chiar soluții potențiale.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'Poți lucra bine în mod independent, în proiecte foarte complexe. Ți-ai pus în aplicare punctul de vedere unic pentru a rezolva probleme complicate și inovezi pentru ajuta domeniul tău să evolueze. Probabil ești bun(ă) în privința comunicării problemelor și a potențialelor soluții și poți conduce echipe de practicieni.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'Probabil că ai condus cu succes echipe, în momentul în care acestea lucrau pe marginea unor inițiative importante, care forțau limitele domeniului tău. Și le poți face pe toate, indiferent dacă ești încă un practician sau petreci marea parte a timpului conducând alte persoane; raționamentele tale sunt respectate de cei din domeniul tău.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'Ești complet autonom(ă) și ești considerat(ă) un lider și o persoană care posedă cunoștințe temeinice în domeniu. Îți poți alege proiectele și probabil că le vei selecta pe acelea care îți vor permite să creezi un impact semnificativ în domeniu și să oferi noi idei sau practici.',
          value: 8,
        },
      ],
    },
    ru: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'Вы лучше всего работаете в организованной среде под контролем, следуя заранее определенным процессам и применяя четкие критерии для оценки результатов.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            'Вы умеете решать простые проблемы и выполнять задания самостоятельно, однако, если возникнут сложные вопросы, вам скорее всего потребуется помощь.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'С новыми трудностями вы, в основном, справляетесь самостоятельно. Вы достаточно знаете о своих новых навыках для самооценки и можете отличить хорошую работу от безупречной. Вы также хорошо научились определять собственные цели для оценки хода их достижения.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'Вы умеете самостоятельно работать над сложными проектами. По их завершении вы можете точно оценить, была ли проведенная вами работа успешной. Хотя вам не требуется внешнего контроля, вы цените мнение других людей и их отзывы о вашей работе.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'Вы можете работать полностью самостоятельно, то есть вы ни от кого не зависите в работе. Вы умеете доводить до конца инициативы без внешнего контроля или почти без него. Вы умеете планировать рабочие процессы, следовать плану и оценивать его эффективность, при этом учитывая другие варианты и потенциальные результаты.\nВероятно, вы пользуетесь доверием в своей сфере. Люди иногда обращаются к вам со своими идеями, проблемами или в разных ситуациях и просят у вас совета или возможных путей решения проблемы.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'Вы умеете самостоятельно работать над очень сложными проектами. Вы уже применяли свои уникальные воззрения для успешного решения сложных вопросов и используете новаторские методы для развития отрасли. Скорее всего, вы умеете ясно описывать суть проблем и потенциальных решений и можете руководить группой специалистов-практиков.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'Вероятно, вы успешно руководили рабочими группами, трудившимися над крупными инициативами, выходившими за обычные рамки отрасли. Вы умеете выполнять разные роли: как практического специалиста, так и руководителя. В любом случае, к вашему мнению прислушиваются в вашей отрасли.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'Вы абсолютно самостоятельны, и вас считают знатоком и крупным специалистом в своей области. У вас есть возможность выбирать проекты, и скорее всего вы выберите те, которые позволяют значительно влиять на отрасль и разрабатывать новые идеи и методы.',
          value: 8,
        },
      ],
    },
    sv: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'Du arbetar bäst inom en strukturerad miljö med handledning, förutbestämda processer och fasta kriterier för bedömning av resultat.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            'Du kan lösa enkla problem och utföra arbetsuppgifter självständigt, men behöver troligen hjälp om det uppstår ett komplicerat problem.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'Du kan för det mesta arbeta självständigt med nya utmaningar. Du har tillräckligt med insyn i dina färdigheter för att kunna vara självkritisk och förstår skillnaden mellan ett bra arbete och ett utmärkt arbete. Du har också blivit bra på att sätta upp egna mål för att bedöma dina framsteg.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'Du kan arbeta självständigt med komplicerade projekt. När projekten är slutförda har du förmågan att betrakta ditt arbete och korrekt avgöra om det har varit lyckat. Fastän du inte behöver handledning värdesätter du andras synpunkter och feedback rörande ditt arbete.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'Du har förmåga att arbeta på egen hand, vilket gör dig självständig. Du kan leda ett initiativ och slutföra det med lite eller ingen handledning. Du kan planera vilka processer du ska använda, tillämpa dem och utvärdera om de var effektiva samtidigt som du överväger andra alternativ och möjliga resultat av dem.\nTroligen har andra förtroende för dig när det gäller ditt område. De kan komma till dig med idéer, situationer eller problem och be om hjälp eller råd.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'Du är bra på att arbeta självständigt med mycket komplicerade projekt. Du har tillämpat ditt eget unika perspektiv för att lösa komplicerade problem och bryter ny mark som har bidragit till framsteg på området. Du är förmodligen bra på att informera om problem och potentiella lösningar och kan leda professionella team.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'Du har troligen framgångsrikt lett team i arbetet med stora projekt som tänjer på gränserna för ditt område. Du klarar dessutom av att ha flera olika roller. Andra inom ditt område respekterar ditt omdöme oavsett om du fortfarande arbetar praktiskt eller ägnar större delen av tiden åt att leda andra.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'Du arbetar helt självständigt och betraktas som en ledare och forskare på området. Du kan välja mellan olika projekt och väljer sannolikt de som gör det möjligt att utöva betydande påverkan på området och introducera nya idéer och metoder.',
          value: 8,
        },
      ],
    },
    th: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'คุณทำงานได้ดีที่สุดในสภาพแวดล้อมแบบมีโครงสร้าง โดยมีการควบคุมดูแล กระบวนการที่กำหนดไว้ล่วงหน้า และเกณฑ์ที่กำหนดขึ้นมาเพื่อใช้ในการตัดสินผลลัพธ์',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            'คุณสามารถแก้ปัญหาพื้นฐานและทำภารกิจต่างๆ  ให้เสร็จสมบูรณ์ได้ด้วยตนเอง  แต่มีแนวโน้มที่จะต้องการความช่วยเหลือเมื่อเกิดปัญหาที่ซับซ้อน',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'โดยส่วนใหญ่แล้ว คุณสามารถทำงานที่เป็นความท้าทายใหม่ๆ ได้ด้วยตนเอง คุณรู้จักทักษะของตนดีพอที่จะวิจารณ์ตนเองได้ และทราบความแตกต่างระหว่างผลงานที่ดีกับผลงานที่ยอดเยี่ยม นอกจากนี้ คุณยังมีความสามารถในการตั้งเป้าหมายของตนเองเพื่อวัดความคืบหน้าอีกด้วย',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'คุณสามารถทำงานในโครงการที่ซับซ้อนได้ด้วยตนเอง  เมื่อโครงการเหล่านั้นเสร็จสมบูรณ์  คุณก็พิจารณาผลงานของคุณและประเมินได้ว่าโครงการประสบความสำเร็จหรือไม่  แม้ว่าคุณไม่จำเป็นต้องได้รับการควบคุมดูแล  แต่คุณก็ให้ความสำคัญกับความคิดเห็นและข้อเสนอแนะจากภายนอกที่มีต่อผลงานของคุณ',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'คุณสามารถทำงานแบบฉายเดี่ยว ซึ่งหมายความว่าคุณอยู่ได้ด้วยตนเอง คุณสามารถเป็นผู้นำโครงการริเริ่มและดำเนินการจนสำเร็จได้โดยมีการควบคุมดูแลเพียงเล็กน้อยหรือไม่มีเลย คุณสามารถวางแผนกระบวนการที่จะใช้ ปรับใช้แผนดังกล่าว และประเมินประสิทธิภาพของแผนไปพร้อมๆ กับพิจารณาทางเลือกและผลลัพธ์ที่เป็นไปได้คุณมีแนวโน้มที่จะได้รับความไว้วางใจเมื่อเป็นสาขาที่คุณเชี่ยวชาญ ผู้อื่นอาจนำไอเดีย สถานการณ์ หรือปัญหาต่างๆ มาขอความเห็นที่ทะลุปรุโปร่งหรือวิธีแก้ปัญหาที่เป็นไปได้จากคุณ',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'คุณสามารถทำงานในโครงการที่ซับซ้อนมากด้วยตนเองได้อย่างมีประสิทธิภาพ คุณใช้มุมมองที่ไม่เหมือนใครในการแก้ไขปัญหาที่ซับซ้อน และใช้วิธีการใหม่ๆ เพื่อช่วยให้วงการก้าวหน้า คุณมีแนวโน้มที่จะสื่อสารได้ดีถึงปัญหาและวิธีแก้ปัญหาที่เป็นไปได้ และสามารถนำทีมผู้ฝึกหัดได้',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'คุณมีแนวโน้มที่จะนำทีมได้อย่างประสบความสำเร็จเมื่อทำงานในโครงการริเริ่มใหญ่ๆ ที่ขยายพรมแดนให้กับสาขาของคุณ และไม่ว่าคุณจะยังเป็นผู้ฝึกหัดอยู่หรือจะใช้เวลาส่วนใหญ่ในการเป็นผู้นำให้กับคนอื่นๆ คุณก็ทำได้ดีทั้งหมด คนในสาขาเดียวกันเคารพการตัดสินใจของคุณ',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'คุณอยู่ได้ด้วยตนเองโดยสมบูรณ์ และคนอื่นๆ มองว่าคุณเป็นผู้นำสาขาและผู้เชี่ยวชาญ คุณมีโครงการที่อยากทำ และคุณมีแนวโน้มที่จะเลือกโครงการที่คุณจะได้สร้างผลกระทบที่สำคัญต่อวงการและนำเสนอไอเดียหรือหลักปฏิบัติใหม่ๆ',
          value: 8,
        },
      ],
    },
    tr: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'Denetim, önceden belirlenmiş süreçler ve sonuçları karşılaştırmak için kriterlerin belirli olduğu yapılandırılmış bir ortamda en verimli şekilde çalışıyorsunuz.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            'Temel sorunları çözebilir ve görevleri kendi başınıza tamamlayabilirsiniz. Ancak, karmaşık bir sorun ortaya çıktığında yardıma ihtiyacınız olabilir.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'Çoğunlukla, yeni zorluklar üzerinde bağımsız olarak çalışabiliyorsunuz. Becerileriniz hakkında kendinizi eleştirecek kadar bilgilisiniz ve iyi bir iş çıkarmak ile mükemmel iş çıkarmak arasındaki farkı biliyorsunuz. Ayrıca, ilerlemeyi ölçmek için kendi hedeflerinizi belirleme konusunda kendinizi geliştirdiniz.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'Karmaşık projelerde bağımsız olarak çalışabiliyorsunuz. Bu projeler tamamlandığında, çalışmanıza bakıp başarılı olup olmadığını doğru bir şekilde değerlendirebiliyorsunuz. Gözetim gerekli olmasa da, işinizle ilgili dışarıdan gelen katkılara ve geri bildirime değer veriyorsunuz.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'Tek kişilik bir ekip olarak hareket edebiliyorsunuz, bu da özerk olduğunuz anlamına geliyor. Bir girişimi yönetebiliyor ve çok az denetimle veya hiç denetim olmadan sonuna kadar götürebiliyorsunuz. Kullanacağınız süreci planlayabilir, bu planı uygulayabilir ve alternatifleri ve olası sonuçları göz önünde bulundurarak ne denli etkili olduğunu değerlendirebilirsiniz. Alanınız söz konusu olduğunda büyük olasılıkla güvenilir birisiniz. Başkaları size fikirlerle, durumlarla veya sorunlarla gelebilir ve içgörülerinizi veya olası çözümlerinizi paylaşmanızı isteyebilir.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'Çok karmaşık projelerde bağımsız olarak verimli şekilde çalışabiliyorsunuz. Karmaşık sorunları çözmek için benzersiz bakış açınızı uyguladınız ve alanın ilerlemesine yardımcı olmak için yenilikler yaptınız. Sorunları ve olası çözümleri iletme konusunda büyük olasılıkla iyisiniz ve uygulayıcı ekiplerine liderlik edebilirsiniz.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'Alanınızdaki sınırları zorlayan büyük girişimler üzerinde çalışan ekipleri büyük olasılıkla başarıyla yönettiniz. Ve hepsini yapabiliyorsunuz. İster hala bir uygulayıcı olun, ister zamanınızın büyük kısmını başkalarına liderlik ederek geçirin, alanınızdaki diğer kişiler görüşlerinize saygı duyuyor.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'Tamamen özerksiniz ve alanınızda bir lider ve bilim insanı olarak kabul ediliyorsunuz. Çeşitli projeler arasından seçim yapma şansınız var ve büyük olasılıkla bu alanda önemli bir etki yaratmanıza ve yeni fikirler veya uygulamalar sunmanıza olanak tanıyacak olanları seçiyorsunuz.',
          value: 8,
        },
      ],
    },
    vi: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description:
            'Bạn làm việc tốt nhất trong một môi trường có tổ chức với sự giám sát, các quy trình được định trước và các tiêu chí được đề ra để đánh giá kết quả theo đó.',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description:
            'Bạn có thể tự mình giải quyết những vấn đề cơ bản và hoàn thành nhiệm vụ—nhưng khi phát sinh một vấn đề phức tạp, bạn có thể sẽ cần một vài sự giúp đỡ.',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            'Phần lớn bạn có thể làm việc độc lập trên các thách thức mới. Bạn biết đủ về những kỹ năng của mình để tự phê bình và biết được sự khác nhau giữa công việc tốt và công việc tuyệt vời. Bạn cũng trở nên giỏi trong việc đề ra các mục tiêu của riêng mình để đánh giá tiến bộ.',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            'Bạn có thể làm việc độc lập trong những dự án phức tạp. Khi những dự án này hoàn thành, bạn có thể xem xét công việc của mình và đánh giá chính xác là công việc có thành công hay không. Mặc dù không cần thiết có sự giám sát, nhưng bạn đánh giá cao ý kiến và phản hồi từ bên ngoài về công việc của bạn.',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            'Bạn có thể hoạt động như là chương trình một người diễn, nghĩa là bạn tự chủ động. Bạn có thể dẫn dắt sáng kiến và theo dõi cho đến khi hoàn thành với một ít hoặc không có sự giám sát. Bạn có thể lập kế hoạch quy trình mà bạn sẽ sử dụng, áp dụng kế hoạch đó và đánh giá hiệu quả của nó trong khi xem xét các phương án thay thế cũng như kết quả tiềm năng.\nCó thể là bạn được tín nhiệm khi nói đến lĩnh vực của bạn. Người khác có thể đến với bạn khi họ có ý kiến, tình huống hoặc vấn đề và hỏi xin ý kiến hoặc giải pháp tiềm năng của bạn.',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            'Bạn có thể làm việc tốt một cách độc lập trong những dự án rất phức tạp. Bạn áp dụng quan điểm độc đáo của mình để giải quyết những vấn đề khó khăn và bạn đổi mới để giúp lĩnh vực tiến bộ. Có thể là bạn làm tốt trong việc truyền đạt các vấn đề và giải pháp tiềm năng và bạn có thể dẫn dắt các nhóm thực hành.',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            'Bạn có thể dẫn dắt nhóm thành công khi họ làm việc với các sáng kiến lớn vượt xa mọi giới hạn trong lĩnh vực của bạn. Và bạn hoàn toàn có thể làm điều đó—dù bạn vẫn là một người thực hành hay bạn dành nhiều thời gian để dẫn dắt người khác, ý kiến đánh giá của bạn luôn được những người khác trong lĩnh vực tôn trọng.',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            'Bạn hoàn toàn độc lập và bạn được xem là người dẫn đầu lĩnh vực và người có học thức. Bạn có sự chọn lựa dự án của mình và bạn có khả năng chọn những dự án cho phép bạn tạo nên sự ảnh hưởng đáng kể trong lĩnh vực cũng như đề ra những ý tưởng hoặc thực hành mới.',
          value: 8,
        },
      ],
    },
    zh: {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description: '在有监督、预定流程和设置判断输出标准的结构化环境中，您有卓越表现。',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description: '您可以自己解决基本问题和完成任务，但当一个复杂的问题出现时，您可能需要一些帮助。',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            '在大多数情况下，您可以独立处理新的挑战。您对自己的技能了如指掌，能够开展自我批评，也知道良好工作和出色工作的区别。您也变得善于设定自己的目标来衡量进步。',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            '您可以独立处理复杂的项目。当这些项目完成后，您能审视自己的工作，准确评估它是否成功。虽然监督不是必须的，但您很重视外部的意见以及对您工作的反馈。',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            '您可以独挡一面，这意味着您具有自主权。您可以领导一项计划，并在几乎没有监督的情况下将其进行到底。您可以计划您将要使用的流程，应用该计划，并评估其有效性，同时考虑替代解决方案和潜在结果。在您所在的领域，您很可能深受信赖。他人可能会向您提出理念、情况或问题，向您寻求深入见解或潜在解决方案。',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            '您可以独立处理非常复杂的项目。您运用自己独特的观点来解决复杂的问题，您的创新促进了该领域的发展。您很可能擅长沟通问题和潜在的解决方案，并能领导从业人员团队。',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            '您很可能成功领导了团队，因为他们致力于推动您所在领域边界的重大计划。您可以做到这一切 — 无论您仍是一名从业人员，还是您花大量的时间领导别人，您的判断力都会受到您领域内人士的尊重。',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            '您具有完全自主权，你被视为领域领袖和学者。您可以选择项目，您可能会选择那些可以让您在领域中产生重大影响并提供新想法或实践的项目。',
          value: 8,
        },
      ],
    },
    'zh-CN': {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description: '在有监督、预定流程和设置判断输出标准的结构化环境中，您有卓越表现。',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description: '您可以自己解决基本问题和完成任务，但当一个复杂的问题出现时，您可能需要一些帮助。',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            '在大多数情况下，您可以独立处理新的挑战。您对自己的技能了如指掌，能够开展自我批评，也知道良好工作和出色工作的区别。您也变得善于设定自己的目标来衡量进步。',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            '您可以独立处理复杂的项目。当这些项目完成后，您能审视自己的工作，准确评估它是否成功。虽然监督不是必须的，但您很重视外部的意见以及对您工作的反馈。',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            '您可以独挡一面，这意味着您具有自主权。您可以领导一项计划，并在几乎没有监督的情况下将其进行到底。您可以计划您将要使用的流程，应用该计划，并评估其有效性，同时考虑替代解决方案和潜在结果。在您所在的领域，您很可能深受信赖。他人可能会向您提出理念、情况或问题，向您寻求深入见解或潜在解决方案。',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            '您可以独立处理非常复杂的项目。您运用自己独特的观点来解决复杂的问题，您的创新促进了该领域的发展。您很可能擅长沟通问题和潜在的解决方案，并能领导从业人员团队。',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            '您很可能成功领导了团队，因为他们致力于推动您所在领域边界的重大计划。您可以做到这一切 — 无论您仍是一名从业人员，还是您花大量的时间领导别人，您的判断力都会受到您领域内人士的尊重。',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            '您具有完全自主权，你被视为领域领袖和学者。您可以选择项目，您可能会选择那些可以让您在领域中产生重大影响并提供新想法或实践的项目。',
          value: 8,
        },
      ],
    },
    'zh-TW': {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: '1',
          description: '在透過監督、預定程序和設定準則來判斷成果的結構化環境中，工作可以達到最佳效果。',
          value: 1,
        },
        {
          id: '',
          name: '2',
          description: '您可以自行解決基本問題並完成任務，但是當出現複雜問題時，您可能需要一些協助。',
          value: 2,
        },
        {
          id: '',
          name: '3',
          description:
            '在大多數情況下，您可以獨立應對新挑戰。您充分瞭解自己的技能，能夠反躬自省，並且知道良好工作與出色工作之間的區別。您也變得善於設定自己的目標來衡量進度。',
          value: 3,
        },
        {
          id: '',
          name: '4',
          description:
            '您可以獨立處理複雜的專案。這些專案完成後，您能夠檢視自己的工作並準確評估它是否成功。雖然不需要監督，但您很重視外界建議和對您工作的意見。',
          value: 4,
        },
        {
          id: '',
          name: '5',
          description:
            '您可以獨挑大樑，這意味著您可以自主行事。您可以領導一項方案，並在幾乎沒有監督的情況下將其貫徹到底。您可以計畫要使用的程序，套用該計畫並評估其有效性，同時考慮其他替代方案和潛在結果。您很可能在自己的領域備受信任。其他人可能會與您分享其構想、現狀或問題，並要求您提供深入解析或潛在的解決方案。',
          value: 5,
        },
        {
          id: '',
          name: '6',
          description:
            '您可以出色地獨立處理非常複雜的專案。您已運用自己獨特的觀點來解決複雜的問題，並且進行了創新來推動該領域的發展。您很可能擅長溝通問題和潛在的解決方案，並可以領導從業人員團隊。',
          value: 6,
        },
        {
          id: '',
          name: '7',
          description:
            '您可能成功領導了團隊致力取得領域突破的重大方案。而且您可以勝任所有工作 — 無論您仍是從業人員還是花費大量時間領導他人，您的判斷力深受業內人士推崇。',
          value: 7,
        },
        {
          id: '',
          name: '8',
          description:
            '您完全自主行事，並被視為某個領域的領袖和學者。您可以選擇專案，並且可能會選取讓您在相關領域產生重大影響並提供新想法或做法的專案。',
          value: 8,
        },
      ],
    },
    'en-TT': {
      id: '',
      name: 'Degreed',
      description:
        'Degreed uses a 1-8 Scale scale to evaluate employee performance in job knowledge, quality of work, productivity, communication, teamwork, and innovation. The system is used for feedback, improvement, and recognition. Regular performance reviews help develop action plans for professional development.',
      totalLevelCount: 8,
      levels: [
        {
          id: '',
          name: 'Level 1',
          description:
            'You work best within a structured environment with supervision, predetermined processes, and set criteria to judge output against.',
          value: 1,
        },
        {
          id: '',
          name: 'Level 2',
          description:
            'You can solve basic problems and complete tasks on your own.\nWhen a complex issue arises, however, you will likely need some help.',
          value: 2,
        },
        {
          id: '',
          name: 'Level 3',
          description:
            'For the most part, you can work independently on new challenges. \n- You know enough about your skills to be self-critical\n- You know the difference between good work and great work. \n- You are good at setting your own goals to measure progress.',
          value: 3,
        },
        {
          id: '',
          name: 'Level 4',
          description:
            'You can work independently on complex projects. \n- You are able to look at your work and accurately evaluate whether it was successful. \n- You do not require supervision,\n- You value external input and feedback on your work.',
          value: 4,
        },
        {
          id: '',
          name: 'Level 5',
          description:
            'You can operate as a one-person show, which means you’re autonomous. \n- You can lead an initiative and see it through to the end with little to no supervision. \n- You can plan the process you’ll use, apply that plan, and evaluate its effectiveness \n- You consider alternatives and the potential outcomes.\n- You are trusted when it comes to your domain. \n- You are resource for ideas to situations or problems.\n- You provide insight or potential solutions when asked.',
          value: 5,
        },
        {
          id: '',
          name: 'Level 6',
          description:
            'You can work well independently on very complex projects. \n- You are good at communicating problems and potential solutions\n- You have applied your unique viewpoint to solve complicated issues, and \n- You innovate to help others the effort advance. \n- You can lead teams of practitioners.',
          value: 6,
        },
        {
          id: '',
          name: 'Level 7',
          description:
            'You’ve likely successfully led teams as they work on big initiatives that push the boundaries of your field. \n- You can do it all. \n- Your judgment is well-respected from those within your domain',
          value: 7,
        },
        {
          id: '',
          name: 'Level 8',
          description:
            'You are completely autonomous, and you are regarded as a domain leader and scholar. \n- You have your choice of projects, and \n- You likely select those projects that will allow you to create significant impact in the field and offer new ideas or practices.',
          value: 8,
        },
      ],
    },
  } satisfies LanguageRegistry,
];

const pluralsightTemplate: Template = [
  'Pluralsight 1-4',
  {
    en: {
      id: '',
      name: 'Pluralsight',
      description: outdent`
    Pluralsight's skill rating scale typically consists of several rating levels or categories that indicate the level of mastery or proficiency in a particular skill.
  `,
      totalLevelCount: 4,
      levels: [
        {
          id: '',
          name: 'Novice',
          description: outdent`
        This rating level indicates that an individual is in the early stages of developing the skill and has limited knowledge or experience in applying it. 
        - The individual requires significant guidance, and 
        - The individual requires support to perform tasks related to the skill.
      `,
          value: 1,
        },
        {
          id: '',
          name: 'Beginner',
          description: outdent`
        Individuals at this level are actively acquiring and expanding their knowledge and capabilities in the skill. 
        - The individual demonstrates progress 
        - The individual may still need some guidance or supervision to perform tasks independently.
      `,
          value: 2,
        },
        {
          id: '',
          name: 'Intermediate',
          description: outdent`
        This rating level signifies that an individual has achieved a satisfactory level of competency in the skill. 
        - The individual possesses the required knowledge, and 
        - The individual has the experience to perform tasks effectively and independently.
      `,
          value: 3,
        },
        {
          id: '',
          name: 'Advanced',
          description: outdent`
        Individuals at this level have demonstrated a high level of mastery and expertise in the skill. 
        The individual consistently 
        - applies the skill in complex or challenging situations, 
        - shows innovative thinking, and 
        - contributes to the skill's advancement within the organization.
      `,
          value: 4,
        },
      ],
    },
  } satisfies LanguageRegistry,
];

export const customTemplate: Template = [
  'Custom',
  { en: { id: '', name: '', description: '', totalLevelCount: 0, levels: [] } } satisfies LanguageRegistry,
];

export const templates: Template[] = [customTemplate, workdayTemplate, degreedTemplate, pluralsightTemplate];
