import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedContent } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    post: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "عنوان جذاب باللغة العربية لا يزيد عن 8 كلمات."
        },
        caption: {
          type: Type.STRING,
          description: "نص البوست الكامل المكون من 4 فقرات باللغة العربية."
        },
        hashtags: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
          description: "ثلاثة هاشتاجات مناسبة باللغة العربية."
        }
      },
      required: ["title", "caption", "hashtags"]
    },
    image: {
      type: Type.OBJECT,
      properties: {
        image_prompt: {
          type: Type.STRING,
          description: "وصف تفصيلي باللغة الإنجليزية لإنشاء صورة."
        }
      },
      required: ["image_prompt"]
    }
  },
  required: ["post", "image"]
};

const topicSuggestionsSchema = {
  type: Type.OBJECT,
  properties: {
    topics: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 4 engaging social media post topics."
    }
  },
  required: ["topics"]
};


export const generateTopicSuggestions = async (): Promise<string[]> => {
    const prompt = `
    أنت خبير استراتيجي في مجال التواصل الاجتماعي لعيادة "Dr. Hayam Neuro Clinic" في مصر، وهي عيادة متخصصة في أمراض المخ والأعصاب.

    مهمتك هي اقتراح 4 أفكار لمواضيع منشورات تكون جذابة ومناسبة جداً للمجتمع المصري.
    
    ركز على استراتيجيات المحتوى التي تزيد من التفاعل والانتشار (Reach)، مثل:
    - **"نصيحة في دقيقة":** نصائح عملية وسريعة.
    - **"حقيقة أم خرافة؟":** تصحيح المفاهيم الطبية الشائعة.
    - **"جسمك بيقولك إيه؟":** تفسير مبسط لأعراض شائعة ومقلقة.
    - **"صحة المخ في...":** ربط العادات اليومية بصحة الدماغ.

    يجب أن تكون المواضيع المقترحة قصيرة، ومثيرة للفضول، ومكتوبة باللغة العربية.

    مثال على المواضيع الجيدة:
    - "لماذا تشعر بـ 'كهرباء' أو تنميل في أطرافك؟"
    - "خرافة: طقطقة الرقبة تسبب سكتة دماغية."
    - "3 أكلات بسيطة لتقوية ذاكرتك اليومية."
    - "الدوخة المفاجئة عند الوقوف: هل هي خطيرة؟"

    النتيجة النهائية يجب أن تكون بصيغة JSON فقط، وهي عبارة عن كائن يحتوي على مصفوفة باسم "topics" بداخلها 4 مواضيع نصية.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: topicSuggestionsSchema,
                temperature: 0.8
            }
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText) as { topics: string[] };
        
        if (!parsedResponse.topics || parsedResponse.topics.length === 0) {
            throw new Error("AI did not return any topic suggestions.");
        }
        
        return parsedResponse.topics;

    } catch (error) {
        console.error("Error generating topic suggestions:", error);
        throw new Error('Failed to generate topic suggestions. Please try again.');
    }
};


export const generateContent = async (topic: string): Promise<GeneratedContent> => {
  const prompt = `
    أنت نظام ذكاء اصطناعي متخصص في إنشاء محتوى يومي لمنصات التواصل الاجتماعي لـ "Dr. Hayam Neuro Clinic" — عيادة متخصصة في أمراض الباطنة والمخ والأعصاب في مصر.
    
    مهمتك هي إنشاء محتوى متكامل (نص وصورة) بناءً على موضوع اليوم.
    موضوع اليوم هو: "${topic}"

    **أولاً: إعداد النص (شخصية طبيب مصري خبير)**
    - اكتب بوستًا من 4 فقرات بلغة عربية بسيطة ودافئة بلهجة مصرية.
    1.  **فقرة أولى (Hook):** ابدأ بجملة قوية تمس مشكلة يعاني منها المصريون تتعلق بالموضوع.
    2.  **فقرتان وسطيتان:** اشرح الأسباب أو العادات الخاطئة ببساطة، بدون مصطلحات طبية معقدة.
    3.  **فقرة أخيرة:** قدم نصيحة عملية ودعوة للتفاعل.
    - أضف 3 هاشتاجات مناسبة في النهاية.

    **ثانيًا: إعداد وصف الصورة (شخصية مصمم طبي محترف، فنان ومبدع)**
    - اكتب وصفًا تفصيليًا باللغة الإنجليزية لمولد الصور (Imagen).
    - كن مبدعًا للغاية وفكر خارج الصندوق. تجنب التفسيرات الحرفية والمباشرة للحالة الطبية قدر الإمكان، وركز على الجانب الإنساني، الشعوري، أو الرمزي للموضوع.

    - **تحديد الشخصيات:** بناءً على موضوع البوست "${topic}"، حدد بذكاء الفئة الأكثر تأثرًا به (شباب، كبار سن، رجال، نساء، أطفال). يجب أن تعكس الشخصيات في الصورة هذه الفئة العمرية والجنس بوضوح.
        - **مثال:** لو الموضوع عن الزهايمر، ركز على كبار السن. لو عن ضغط العمل، ركز على الشباب في منتصف العمر. لو عن صحة الأمومة، ركز على النساء.
        - **مهم:** إذا كانت الصورة تتضمن سيدة، يجب أن تكون محجبة دائمًا (If the image features a woman, she must be wearing a hijab).

    - **النمط الفني (Art Style):** اختر بذكاء وبشكل عشوائي في كل مرة نمطًا فنيًا مختلفًا من القائمة الموسعة التالية لضمان التنوع البصري. صف النمط بوضوح في البرومبت الإنجليزي:
        - **Photorealistic, emotional:** (واقعي، يركز على المشاعر الإنسانية العميقة)
        - **Cinematic, dramatic lighting:** (سينمائي، إضاءة درامية قوية)
        - **3D render, clean, medical illustration:** (تصميم ثلاثي الأبعاد، نقي، كأنه توضيح طبي حديث)
        - **Symbolic vector art:** (فن متجهي رمزي، يعبر عن الفكرة بأقل العناصر)
        - **Abstract conceptual art:** (فن تجريدي مفاهيمي يمثل العمليات العصبية أو المشاعر)
        - **Double exposure photography:** (تصوير بالتعريض المزدوج، يدمج صورة شخص مع رمز للمشكلة مثل شبكة أعصاب أو ساعة)
        - **Surreal, dream-like art:** (فن سريالي حالم، يصور الحالة النفسية بطريقة غير واقعية ومدهشة)
        - **Hopeful and light, painterly style:** (أسلوب رسم زيتي مفعم بالأمل والنور)

    - **الإبداع في المشهد:** لا تكتفِ بتصوير الشخص المريض. ابتكر مشاهد رمزية قوية. (مثلاً: لضعف التركيز، صورة شخص ملامحه تتلاشى وتتداخل مع صفحات كتاب. للأرق، غرفة نوم بسقف على شكل سماء ليلية مضطربة).
    
    - **المواصفات الإلزامية:**
      - **الأشخاص:** ملامح مصرية أو عربية (Egyptian or Arab features).
      - **الإضاءة:** ناعمة وسينمائية (Soft, cinematic lighting).
      - **الخلفية:** طبية بسيطة، منزلية دافئة، أو رمزية حسب النمط.
      - **الألوان:** يجب أن تتضمن ألوان البراند بلمسات ذكية: Mint Green (#7AC943) and Soft Medical Purple (#A066A6).
      - **الدقة:** High Resolution.
      - **تكوين الصورة:** يجب أن تحتوي على مساحة فارغة (Negative Space).
      - **ممنوعات:** لا شعارات، نصوص، أو علامات تجارية (No logos, text, or brands).

    **النتيجة النهائية يجب أن تكون بصيغة JSON فقط، مطابقة تمامًا للهيكل المحدد.**
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.95 // Increased temperature slightly for more creativity
      }
    });

    const jsonText = response.text.trim();
    const parsedContent = JSON.parse(jsonText) as GeneratedContent;
    return parsedContent;

  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
        throw new Error('Failed to parse the response from the AI. The format might be incorrect.');
    }
    throw new Error('Failed to generate content. Please check your connection and API key.');
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return base64ImageBytes;
    } else {
      throw new Error("No image was generated by the API.");
    }
  } catch (error) {
    console.error("Error generating image from Gemini API:", error);
    throw new Error('Failed to generate image. Please try again.');
  }
};