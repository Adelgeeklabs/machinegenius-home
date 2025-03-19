"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import fetchAPI from "../../../../_components/fetchAPIUtilies/fetchApiUtilies";

import toast from "react-hot-toast";

type PlanType =
  | "Influencer"
  | "Finance"
  | "Agency"
  | "Corporation"
  | "HoldingsBase";
type FormType = "single" | "holdings";

interface Subsidiary {
  package: string;
  quantity: number;
  name: string;
  address: string;
}

interface FormData {
  type: FormType;
  name: string;
  address: string;
  package: string;
  quantity: number;
  subsidiaries: Subsidiary[];
}

const SignupPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planName = searchParams.get("plan");
  const planType = searchParams.get("type") as FormType;

  const [formData, setFormData] = useState<FormData>({
    type: planType || "single",
    name: "",
    address: "",
    package: planName || "",
    quantity: 1,
    subsidiaries: [
      {
        package: "",
        quantity: 1,
        name: "",
        address: "",
      },
    ],
  });

  const [formErrors, setFormErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const plans: Record<PlanType, number> = {
    Influencer: 10000,
    Finance: 15000,
    Agency: 20000,
    Corporation: 25000,
    HoldingsBase: 5000,
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubsidiaryChange = (
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const newSubsidiaries = [...formData.subsidiaries];
    newSubsidiaries[index] = {
      ...newSubsidiaries[index],
      [name]: name === "quantity" ? parseInt(value) || 1 : value,
    };
    setFormData({
      ...formData,
      subsidiaries: newSubsidiaries,
    });
  };

  const addSubsidiary = () => {
    setFormData({
      ...formData,
      subsidiaries: [
        ...formData.subsidiaries,
        {
          package: "",
          quantity: 1,
          name: "",
          address: "",
        },
      ],
    });
  };

  const removeSubsidiary = (index: number) => {
    const newSubsidiaries = [...formData.subsidiaries];
    newSubsidiaries.splice(index, 1);
    setFormData({
      ...formData,
      subsidiaries: newSubsidiaries,
    });
  };

  const validateForm = () => {
    const errors: any = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }

    if (formData.type === "holdings") {
      const subsidiaryErrors: any[] = [];
      let hasError = false;

      formData.subsidiaries.forEach((sub, index) => {
        const subError: any = {};
        if (!sub.name.trim()) {
          subError.name = "Name is required";
          hasError = true;
        }
        if (!sub.address.trim()) {
          subError.address = "Address is required";
          hasError = true;
        }
        if (!sub.package) {
          subError.package = "Package is required";
          hasError = true;
        }
        if (sub.quantity < 1) {
          subError.quantity = "Quantity must be at least 1";
          hasError = true;
        }

        if (Object.keys(subError).length > 0) {
          subsidiaryErrors[index] = subError;
        }
      });

      if (hasError) {
        errors.subsidiaries = subsidiaryErrors;
      }
    } else {
      if (!formData.package) {
        errors.package = "Package is required";
      }
      if (formData.quantity < 1) {
        errors.quantity = "Quantity must be at least 1";
      }
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);

      // Format the submission data based on plan type
      let submissionData;

      if (formData.type === "holdings") {
        submissionData = {
          type: "holdings",
          name: formData.name,
          address: formData.address,
          subsidiaries: formData.subsidiaries.map((sub) => ({
            package: sub.package,
            quantity: parseInt(String(sub.quantity)),
            name: sub.name,
            address: sub.address,
          })),
        };
      } else {
        submissionData = {
          type: "single",
          name: formData.name,
          address: formData.address,
          package: formData.package,
          quantity: parseInt(String(formData.quantity)),
        };
      }
      try {
        const response = await fetch(
          `https://stripe-5-81rj.onrender.com/stripe/create-checkout-session`,
          {
            method: "POST",
            body: JSON.stringify(submissionData),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.ok) {
          toast.success("Registration successful!");
          router.push("/signin");
        }
      } catch (error) {
        toast.error("Something Went Wrong");
      } finally {
        setIsSubmitting(false);
      }

      // Here you would normally submit the data to your API
      console.log("Submitting data:", submissionData);
    } else {
      setFormErrors(errors);
    }
  };

  // Calculate total cost
  const calculateTotal = () => {
    if (formData.type === "holdings") {
      const basePrice = plans["HoldingsBase"];
      const subsidiariesCost = formData.subsidiaries.reduce((total, sub) => {
        // Safely access the plans object
        const packagePrice =
          sub.package &&
          (plans as Record<string, number>)[sub.package as PlanType];
        return total + (packagePrice || 0) * sub.quantity;
      }, 0);
      return (basePrice + subsidiariesCost) / 100;
    } else {
      // Safely access the plans object
      const packagePrice =
        formData.package &&
        (plans as Record<string, number>)[formData.package as PlanType];
      return ((packagePrice || 0) * formData.quantity) / 100;
    }
  };

  return (
    <div className="py-[150px] text-[#FFFFFB] px-[--98px]">
      <Link
        href="/pricing"
        className="mb-[--sy-50px] inline-block text-[--22px] hover:underline"
      >
        &larr; Back to Pricing
      </Link>

      <h1 className="font-extrabold text-[--98px] mb-[--sy-80px]">
        {formData.type === "holdings" ? "Holdings Setup" : "Signup"}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="mb-[--sy-50px]">
          <label className="block text-[--33px] mb-[--sy-15px]">
            Company Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full bg-transparent border-2 ${
              formErrors.name ? "border-red-500" : "border-[#FFFFFB]"
            } rounded-[--8px] p-[--sy-20px] text-[--22px]`}
            placeholder="Enter your company name"
          />
          {formErrors.name && (
            <p className="text-red-500 mt-[--sy-10px]">{formErrors.name}</p>
          )}
        </div>

        <div className="mb-[--sy-50px]">
          <label className="block text-[--33px] mb-[--sy-15px]">
            Company Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`w-full bg-transparent border-2 ${
              formErrors.address ? "border-red-500" : "border-[#FFFFFB]"
            } rounded-[--8px] p-[--sy-20px] text-[--22px] min-h-[--sy-150px]`}
            placeholder="Enter your company address"
          />
          {formErrors.address && (
            <p className="text-red-500 mt-[--sy-10px]">{formErrors.address}</p>
          )}
        </div>

        {formData.type === "single" ? (
          <>
            <div className="mb-[--sy-50px]">
              <label className="block text-[--33px] mb-[--sy-15px]">
                Package
              </label>
              <select
                name="package"
                value={formData.package}
                onChange={handleChange}
                className={`w-full bg-[#2A2B2A] border-2 ${
                  formErrors.package ? "border-red-500" : "border-[#FFFFFB]"
                } rounded-[--8px] p-[--sy-20px] text-[--22px]`}
              >
                <option value="">Select a package</option>
                <option value="Influencer">Influencer ($100.00)</option>
                <option value="Finance">Finance ($150.00)</option>
                <option value="Agency">Agency ($200.00)</option>
                <option value="Corporation">Corporation ($250.00)</option>
              </select>
              {formErrors.package && (
                <p className="text-red-500 mt-[--sy-10px]">
                  {formErrors.package}
                </p>
              )}
            </div>

            <div className="mb-[--sy-50px]">
              <label className="block text-[--33px] mb-[--sy-15px]">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className={`w-full bg-transparent border-2 ${
                  formErrors.quantity ? "border-red-500" : "border-[#FFFFFB]"
                } rounded-[--8px] p-[--sy-20px] text-[--22px]`}
              />
              {formErrors.quantity && (
                <p className="text-red-500 mt-[--sy-10px]">
                  {formErrors.quantity}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="mb-[--sy-80px]">
            <div className="flex justify-between items-center mb-[--sy-30px]">
              <h2 className="font-bold text-[--50px]">Subsidiaries</h2>
              <button
                type="button"
                onClick={addSubsidiary}
                className="bg-[#FFFFFB] text-[#2A2B2A] rounded-[--8px] py-[--sy-15px] px-[--29px] text-[--20px] font-bold"
              >
                Add Subsidiary
              </button>
            </div>

            {formData.subsidiaries.map((subsidiary, index) => (
              <div
                key={index}
                className="mb-[--sy-50px] p-[--sy-30px] border-2 border-[#FFFFFB] rounded-[--8px]"
              >
                <div className="flex justify-between items-center mb-[--sy-30px]">
                  <h3 className="font-bold text-[--33px]">
                    Subsidiary {index + 1}
                  </h3>
                  {formData.subsidiaries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSubsidiary(index)}
                      className="text-red-500 text-[--20px]"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="mb-[--sy-30px]">
                  <label className="block text-[--22px] mb-[--sy-10px]">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={subsidiary.name}
                    onChange={(e) => handleSubsidiaryChange(index, e)}
                    className={`w-full bg-transparent border-2 ${
                      formErrors.subsidiaries?.[index]?.name
                        ? "border-red-500"
                        : "border-[#FFFFFB]"
                    } rounded-[--8px] p-[--sy-15px] text-[--20px]`}
                    placeholder="Subsidiary name"
                  />
                  {formErrors.subsidiaries?.[index]?.name && (
                    <p className="text-red-500 mt-[--sy-5px]">
                      {formErrors.subsidiaries[index].name}
                    </p>
                  )}
                </div>

                <div className="mb-[--sy-30px]">
                  <label className="block text-[--22px] mb-[--sy-10px]">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={subsidiary.address}
                    onChange={(e) => handleSubsidiaryChange(index, e)}
                    className={`w-full bg-transparent border-2 ${
                      formErrors.subsidiaries?.[index]?.address
                        ? "border-red-500"
                        : "border-[#FFFFFB]"
                    } rounded-[--8px] p-[--sy-15px] text-[--20px] min-h-[--sy-100px]`}
                    placeholder="Subsidiary address"
                  />
                  {formErrors.subsidiaries?.[index]?.address && (
                    <p className="text-red-500 mt-[--sy-5px]">
                      {formErrors.subsidiaries[index].address}
                    </p>
                  )}
                </div>

                <div className="mb-[--sy-30px]">
                  <label className="block text-[--22px] mb-[--sy-10px]">
                    Package
                  </label>
                  <select
                    name="package"
                    value={subsidiary.package}
                    onChange={(e) => handleSubsidiaryChange(index, e)}
                    className={`w-full bg-[#2A2B2A] border-2 ${
                      formErrors.subsidiaries?.[index]?.package
                        ? "border-red-500"
                        : "border-[#FFFFFB]"
                    } rounded-[--8px] p-[--sy-15px] text-[--20px]`}
                  >
                    <option value="">Select a package</option>
                    <option value="Influencer">Influencer ($100.00)</option>
                    <option value="Finance">Finance ($150.00)</option>
                    <option value="Agency">Agency ($200.00)</option>
                    <option value="Corporation">Corporation ($250.00)</option>
                  </select>
                  {formErrors.subsidiaries?.[index]?.package && (
                    <p className="text-red-500 mt-[--sy-5px]">
                      {formErrors.subsidiaries[index].package}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[--22px] mb-[--sy-10px]">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={subsidiary.quantity}
                    onChange={(e) => handleSubsidiaryChange(index, e)}
                    min="1"
                    className={`w-full bg-transparent border-2 ${
                      formErrors.subsidiaries?.[index]?.quantity
                        ? "border-red-500"
                        : "border-[#FFFFFB]"
                    } rounded-[--8px] p-[--sy-15px] text-[--20px]`}
                  />
                  {formErrors.subsidiaries?.[index]?.quantity && (
                    <p className="text-red-500 mt-[--sy-5px]">
                      {formErrors.subsidiaries[index].quantity}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mb-[--sy-80px] p-[--sy-30px] border-2 border-[#FFFFFB] rounded-[--8px]">
          <h3 className="font-bold text-[--33px] mb-[--sy-20px]">
            Order Summary
          </h3>
          {formData.type === "holdings" && (
            <div className="flex justify-between mb-[--sy-15px]">
              <span className="text-[--22px]">HoldingsBase</span>
              <span className="text-[--22px]">
                ${(plans["HoldingsBase"] / 100).toFixed(2)}
              </span>
            </div>
          )}

          {formData.type === "holdings"
            ? formData.subsidiaries.map(
                (sub, index) =>
                  sub.package && (
                    <div
                      key={index}
                      className="flex justify-between mb-[--sy-15px]"
                    >
                      <span className="text-[--22px]">
                        {sub.name || `Subsidiary ${index + 1}`} ({sub.package} ×{" "}
                        {sub.quantity})
                      </span>
                      <span className="text-[--22px]">
                        $
                        {(
                          (((sub.package &&
                            (plans as Record<string, number>)[
                              sub.package as PlanType
                            ]) ||
                            0) *
                            sub.quantity) /
                          100
                        ).toFixed(2)}
                      </span>
                    </div>
                  )
              )
            : formData.package && (
                <div className="flex justify-between mb-[--sy-15px]">
                  <span className="text-[--22px]">
                    {formData.package} × {formData.quantity}
                  </span>
                  <span className="text-[--22px]">
                    $
                    {(
                      (((formData.package &&
                        (plans as Record<string, number>)[
                          formData.package as PlanType
                        ]) ||
                        0) *
                        formData.quantity) /
                      100
                    ).toFixed(2)}
                  </span>
                </div>
              )}

          <div className="border-t-2 border-[#FFFFFB] mt-[--sy-20px] pt-[--sy-20px]">
            <div className="flex justify-between">
              <span className="font-bold text-[--33px]">Total</span>
              <span className="font-bold text-[--33px]">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#FFFFFB] text-[#2A2B2A] rounded-[--8px] py-[--sy-20px] px-[--38px] text-[--22px] font-bold w-full hover:bg-opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Processing..." : "Complete Purchase"}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
