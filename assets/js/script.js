        function getJSONByCallbacks(url, successHandler, errorHandler) {
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'json';
            xhr.open('GET', url, true);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var data = (!xhr.responseType) ? JSON.parse(xhr.response) : xhr.response;
                    successHandler && successHandler(data)
                } else {
                    errorHandler && errorHandler(`Error: ${xhr.status}`);
                }
            };
            xhr.onerror = function () {
                errorHandler && errorHandler('Network Error!');
            }
            xhr.send(null);
        }


        var previousSpots = [];

        function getParking() {
            var currentSpots = [];
            var spaceStatus;

            for (i = 0; i < currentSpots.length; i++) {
                if (previousSpots[i] == currentSpots[i]) {
                    spaceStatus = "/";
                    return spaceStatus;
                } else if (previousSpots[i] > currentSpots[i]) {
                    spaceStatus = "down";
                    return spaceStatus;
                } else if (previousSpots[i] < currentSpots[i]) {
                    spaceStatus = "up";
                }
            }


            getJSONByCallbacks(
                'https://datatank.stad.gent/4/mobiliteit/bezettingparkingsrealtime.json',
                function (data) {
                    var parking_container = document.querySelector('.parking_container');
                    var tempStr = '';



                    for (i = 0; i < data.length; i++) {
                        parkingStatus = data[i].parkingStatus.open; {
                            if (parkingStatus == true) {
                                status = "Open";
                            } else {
                                status = "Gesloten";
                            }
                        }



                        tempStr += `

        <div class="parking" style="background-color:${color()}">
            <div class="parking_name"> ${data[i].city.name}</div>
            <div class="parking_address"> ${data[i].address}</div>
            <div class="parking_contact_info">${data[i].contactInfo}</div>
            <div class="parking_available_capacity">Vrije plaatsen: ${data[i].parkingStatus.availableCapacity}</div>
            <div class="parking_total_capacity">Totaal aantal plaatsen: ${data[i].parkingStatus.totalCapacity}</div>
            <div class="parking_status">Parking status: ${status}</div>
            <div class="parking_space_status">Parking space went ${spaceStatus}</div>
        </div>
`;
                        parking_container.innerHTML = tempStr;
                        var parkingBackground = document.querySelectorAll(".parking");
                        var aCapacity = data[i].parkingStatus.availableCapacity;
                        var tCapacity = data[i].parkingStatus.totalCapacity;

                        function color() {

                            if (aCapacity > (tCapacity / 2)) {
                                var green = "green";
                                return green;
                            } else if ((tCapacity / 5) >= aCapacity <= (tCapacity / 2)) {
                                var orange = "orange";
                                return orange;
                            } else if (aCapacity < (tCapacity / 5)) {
                                var red = "red";
                                return red;
                            }
                        }


                        currentSpots.push(data[i].parkingStatus.availableCapacity);
                    };
                    console.log("Previous spots: " + previousSpots);
                    console.log("Current spots: " + currentSpots);

                    for (i = 0; i < currentSpots.length; i++) {
                        previousSpots[i] = currentSpots[i];
                    }

                },
                function (error) {
                    console.log(error);
                }
            );
        }
        getParking();
        var refresh = setInterval(getParking, 10000);
