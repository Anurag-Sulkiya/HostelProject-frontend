import { Card, CardContent, CardHeader } from "@mui/material";
import React from "react";

const RoleSpecificTermsAndBenefits = ({ getCurrentRoleName }) => {
  const currentRole = getCurrentRoleName();

  const roleContent = {
    student: {
      terms: [
        "Maintain a clean and tidy living space",
        "Respect quiet hours from 10 PM to 7 AM",
        "No illegal substances or activities on the premises",
        "Notify management of any maintenance issues promptly",
        "Adhere to all safety protocols and emergency procedures",
      ],
      benefits: [
        "Access to study areas and common rooms",
        "High-speed internet connection",
        "Organized social events and activities",
        "Discounted rates for long-term stays",
        "24/7 security and support",
      ],
    },
    hostelOwner: {
      terms: [
        "Provide a safe and clean living environment",
        "Maintain all necessary licenses and permits",
        "Respect tenant privacy and provide adequate notice for inspections",
        "Address maintenance requests in a timely manner",
        "Comply with all local housing laws and regulations",
      ],
      benefits: [
        "Listing visibility on our platform",
        "Secure payment processing",
        "Access to a large pool of potential tenants",
        "Property management tools and resources",
        "Marketing support and analytics",
      ],
    },
  };

  const roleName = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-indigo-700">
        Terms and Benefits for {roleName}s
      </h2>
      <div className="flex flex-col lg:flex-row gap-8">
        <Card className="flex-1">
          <CardHeader>
            <h3 className="text-xl font-semibold text-indigo-700">
              Terms and Conditions
            </h3>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentRole && roleContent[currentRole] && (
              <div className="text-sm text-gray-600 space-y-4">
                <div>
                  <h4 className="font-medium text-indigo-600">
                    Terms For {roleName}s:
                  </h4>

                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    {roleContent[currentRole].terms.map((term, index) => (
                      <li key={index}>{term}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <div>
              <h4 className="font-medium text-indigo-600">
                Additional Information
              </h4>
              <p className="mt-2 text-sm text-gray-600">
                By registering, you agree to abide by all hostel rules and
                regulations. Failure to comply may result in termination of your
                stay or listing.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <h3 className="text-xl font-semibold text-indigo-700">Benefits</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentRole && roleContent[currentRole] && (
              <>
                <h4 className="font-medium text-indigo-600">
                  Exclusive benefits for {roleName}s:
                </h4>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                  {roleContent[currentRole].benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </>
            )}
            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-indigo-600">
                You are registering as a:
              </p>
              <p className="text-lg font-bold text-indigo-700">{roleName}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleSpecificTermsAndBenefits;
