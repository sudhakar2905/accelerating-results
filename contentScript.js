function speakText(text) {
  var utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

const apiKey =
  "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"; // Replace with your actual API key

document.addEventListener("mouseup", async function (event) {
  var selection = window.getSelection();
  var selectedText = selection.toString().trim();
  var words = selectedText.split(" ");
  var option, tooltip, info;

  // If only one word is selected
  if (words.length === 1 && words[0] !== "") {
    option = document.getElementById("option");

    // Create and display the option buttons if not already present
    if (!option) {
      option = document.createElement("div");
      option.id = "option";
      option.style.left = event.pageX + "px";
      option.style.top = event.pageY + "px";
      option.style.display = "block";

      document.body.appendChild(option);

      const dictionaryButton = document.createElement("button");
      dictionaryButton.id = "dictbtn";
      dictionaryButton.textContent = "Dict";

      const openaiButton = document.createElement("button");
      openaiButton.id = "openaibtn";
      openaiButton.textContent = "OpenAI";

      option.appendChild(dictionaryButton);
      option.appendChild(openaiButton);

      // Event handler for OpenAI button
      openaiButton.onclick = async function () {
        option.parentNode.removeChild(option); // Remove option
        info = document.getElementById("info");

        if (!info) {
          info = document.createElement("div");
          info.id = "info";
          info.style.left = event.pageX + "px";
          info.style.top = event.pageY + "px";
          document.body.appendChild(info);
        }

        try {
          const wordMeaning = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                  {
                    role: "user",
                    content: `What is the meaning of ${words[0]}? (in less than 20 words)`,
                  },
                ],
              }),
            }
          );

          const response = await wordMeaning.json();
          console.log("OpenAI API Response:", response); // Log API response
          const textMeaning = response.choices[0].message.content;

          info.textContent = textMeaning;
          speakText(textMeaning);
          info.style.display = "block";
        } catch (error) {
          console.error("Error fetching meaning from OpenAI:", error);
        }
      };

      // Event handler for Dictionary button
      dictionaryButton.onclick = async function () {
        option.parentNode.removeChild(option); // Remove option
        info = document.getElementById("info");

        if (!info) {
          info = document.createElement("div");
          info.id = "info";
          info.style.left = event.pageX + "px";
          info.style.top = event.pageY + "px";
          document.body.appendChild(info);
        }

        try {
          const wordMeaning = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${words[0]}`
          );
          const response = await wordMeaning.json();
          console.log("Dictionary API Response:", response); // Log API response
          const textMeaning = response[0].meanings[0].definitions[0].definition;

          info.textContent = textMeaning;
          speakText(textMeaning);
          info.style.display = "block";
        } catch (error) {
          console.error("Error fetching meaning from Dictionary API:", error);
        }
      };
    }
  } else if (selectedText.length > 0) {
    // If more than one word is selected
    tooltip = document.getElementById("tooltip");

    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "tooltip";
      document.body.appendChild(tooltip);
    }

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: selectedText }],
          }),
        }
      );

      const data = await response.json();
      console.log("OpenAI API Response for Selected Text:", data); // Log API response
      const textInfo = data.choices[0].message.content;

      tooltip.style.left = event.pageX + "px";
      tooltip.style.top = event.pageY + "px";
      tooltip.textContent = textInfo;
      speakText(textInfo);
      tooltip.style.display = "block"; // Show tooltip
    } catch (error) {
      console.error("Error fetching data from OpenAI:", error);
    }
  } else {
    // Remove all overlays if no text is selected
    tooltip = document.getElementById("tooltip");
    option = document.getElementById("option");
    info = document.getElementById("info");

    if (tooltip) tooltip.parentNode.removeChild(tooltip);
    if (option) option.parentNode.removeChild(option);
    if (info) info.parentNode.removeChild(info);
  }
});
